import { z } from "zod";
import { createCode } from "@/lib/actions/code";
import { createSchema } from "@/lib/constants";

export async function PUT(req: Request) {
  let formData: typeof createSchema._type;

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

  if (!code.success)
    return Response.json(code, {
      status: 400,
    });

  return Response.json(code, {
    status: 201,
  });
}
