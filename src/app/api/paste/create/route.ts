import { type NextApiRequest } from "next";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { languageValues } from "@/config/code";
import { createServiceServer } from "@/lib/supabase/service-server";
import { nanoid } from "@/lib/utils";
import argon2 from "@node-rs/argon2";
import { createCode } from "@/lib/actions/code";

export const fileSizeLimit = Number(process.env.MAX_SIZE_LIMIT) || 10;
export const pasteIdLength = Number(process.env.PASTE_ID_LENGTH) || 10;

const languageSchema = z.enum(languageValues);
export const schema = zfd
  .formData({
    file: zfd.file(),
    adminPassword: z.string().nullish(),
    language: languageSchema.default("plaintext"),
  })
  .refine((args) => args.file.size <= fileSizeLimit * 1024 * 1024, {
    message: `File size should not exceed ${fileSizeLimit}MB`,
  });

export async function PUT(req: Request) {
  let formData: typeof schema._type;

  try {
    formData = schema.parse(await req.formData());
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
