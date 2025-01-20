import { ipAddress } from "@vercel/functions";

import rateLimit from "@/lib/rate-limit";
import { viewCode } from "@/lib/actions/code";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Max 100 users per minute
});

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; accessPassword?: string }>;
  },
) {
  const ip = ipAddress(req) || "IP-NOT-DETECTED";

  const rateLimit = limiter.check(10, ip);

  if (rateLimit.rateLimited) {
    return Response.json(
      {
        success: false,
        error: "Rate limit exceeded",
      },
      {
        status: 429,
      },
    );
  }

  const code = await viewCode({
    id: (await params).id,
    accessPassword: (await params).accessPassword,
  });

  return Response.json(code, {
    status: code.success ? 200 : 400,
  });
}
