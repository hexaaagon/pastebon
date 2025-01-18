import { checkAuthorizationKey } from "@/lib/actions/authorization";
import { createServiceServer } from "@/lib/supabase/service-server";

export async function POST(req: Request) {
  const authorizationKey = req.headers.get("Authorization");
  const check = await checkAuthorizationKey(authorizationKey);

  if (!check.success) return Response.json(check, { status: 401 });

  const supabase = createServiceServer();
  const pasteDatabase = await supabase.from("paste").select("id");

  if (pasteDatabase.error) return Response.json({ success: false });

  const storage = supabase.storage.from("paste");
  const storageList = await storage.list();

  if (storageList.error) return Response.json({ success: false });

  const databaseIds = pasteDatabase.data.map((paste) => paste.id);
  const storageIds = storageList.data.map((file) => file.name.split(".")[0]);

  const missingInDatabase = storageIds.filter(
    (id) => !databaseIds.includes(id),
  );
  const missingInStorage = databaseIds.filter((id) => !storageIds.includes(id));

  for (const id of missingInDatabase) {
    await storage.remove([`${id}.txt`]);
  }

  for (const id of missingInStorage) {
    await supabase.from("paste").delete().eq("id", id);
  }

  return Response.json({ success: true });
}
