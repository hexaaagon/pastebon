import { checkAuthorizationKey } from "@/lib/actions/authorization";
import { createServiceServer } from "@/lib/supabase/service-server";

export async function POST(req: Request) {
  const authorizationKey = req.headers.get("Authorization");
  const check = await checkAuthorizationKey(authorizationKey);

  if (!check.success) return Response.json(check, { status: 401 });

  const supabase = createServiceServer();
  const pasteDatabase = await supabase
    .from("paste")
    .select("path, expires_at")
    .lte("expires_at", new Date().toISOString());

  if (pasteDatabase.error) return Response.json({ success: false });

  if (pasteDatabase.data.length > 0) {
    for (const paste of pasteDatabase.data) {
      await supabase.storage.from("paste").remove([paste.path]);
    }
  }

  return Response.json({ success: true });
}
