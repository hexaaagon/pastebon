import { ipAddress } from "@vercel/functions";
import { z } from "zod";

import { createCode } from "@/lib/actions/code";
import { createSchema } from "@/lib/constants";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50, // Max 50 users per minute
});

export async function PUT(req: Request) {
  let formData: typeof createSchema._type;
  const ip = ipAddress(req) || "IP-NOT-DETECTED";

  const rateLimit = limiter.check(5, ip);

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

  try {
    formData = createSchema.parse(await req.formData());
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: err.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    } else {
      return Response.json(
        {
          success: false,
          error: err,
        },
        {
          status: 500,
        },
      );
    }
  }

  const code = await createCode(formData);

  return Response.json(code, {
    status: code.success ? 201 : 400,
  });
}
