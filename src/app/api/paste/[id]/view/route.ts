import { viewCode } from "@/lib/actions/code";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const code = await viewCode((await params).id);

  return Response.json(code, {
    status: code.success ? 200 : 400,
  });
}
