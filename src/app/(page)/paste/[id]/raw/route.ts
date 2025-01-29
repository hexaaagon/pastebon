import { viewCode } from "@/lib/actions/code";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const code = await viewCode({ id: (await params).id });

  if (!code.success)
    return Response.json(code, {
      status: 400,
    });

  return new Response(code.data.paste, {
    status: 200,
  });
}
