import { ipAddress } from "@vercel/functions";
import { z } from "zod";

import { createCode } from "@/lib/actions/code";
import { createSchema } from "@/lib/constants";

export async function PUT(req: Request) {
  let formData: typeof createSchema._type;
  const ip = ipAddress(req);

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

  const code = await createCode(formData, ip);

  return Response.json(code, {
    status: code.success ? 201 : 400,
  });
}
