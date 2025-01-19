import { viewCode } from "@/lib/actions/code";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; accessPassword?: string }>;
  },
) {
  const code = await viewCode({
    id: (await params).id,
    accessPassword: (await params).accessPassword,
  });

  return Response.json(code, {
    status: code.success ? 200 : 400,
  });
}
