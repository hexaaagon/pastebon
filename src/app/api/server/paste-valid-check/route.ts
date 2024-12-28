import { checkAuthorizationKey } from "@/lib/actions/authorization";

export async function POST(req: Request) {
  const authorizationKey = req.headers.get("Authorization");
  const check = await checkAuthorizationKey(authorizationKey);

  if (!check.success) return Response.json(check, { status: 401 });

  return Response.json({ success: true });
}
