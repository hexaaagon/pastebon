import { ipAddress } from "@vercel/functions";

import { viewCode } from "@/lib/actions/code";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; accessPassword?: string }>;
  },
) {
  const ip = ipAddress(req);

  const code = await viewCode(
    {
      id: (await params).id,
      accessPassword: (await params).accessPassword,
    },
    ip,
  );

  return Response.json(code, {
    status: code.success ? 200 : 400,
  });
}
