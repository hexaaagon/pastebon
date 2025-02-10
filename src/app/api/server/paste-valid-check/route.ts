import { checkAuthorizationKey } from "@/lib/actions/authorization";
import { createServiceServer } from "@/lib/supabase/service-server";

export async function POST(req: Request) {
  const authorizationKey = req.headers.get("Authorization");
  const check = await checkAuthorizationKey(authorizationKey);

  if (!check.success) return Response.json(check, { status: 401 });

  const supabase = createServiceServer();
  const pasteDatabase = await supabase.from("paste").select("id, expires_at");

  if (pasteDatabase.error) return Response.json({ success: false });

  const storage = supabase.storage.from("paste");
  const storageList = await storage.list("pastes");

  if (storageList.error) return Response.json({ success: false });

  const databaseIds = pasteDatabase.data.map((paste) => paste.id);
  const storageIds = storageList.data.map((file) => file.name.split(".")[0]);

  const currentTime = new Date().getTime();

  const missingInDatabase = databaseIds.filter((id, index) => {
    const paste = pasteDatabase.data[index];
    const pasteTime = paste.expires_at && new Date(paste.expires_at).getTime();

    if (!storageIds.includes(id)) {
      return pasteTime && pasteTime > currentTime;
    }
    return false;
  });
  const missingInStorage = storageIds.filter((id) => !databaseIds.includes(id));

  await storage.remove(missingInStorage.map((id) => `pastes/${id}.txt`));
  await supabase.from("paste").delete().in("id", missingInDatabase);

  return Response.json({ success: true });
}
