import { type NextApiRequest } from "next";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { languageValues } from "@/config/code";
import { createServiceServer } from "@/lib/supabase/service-server";
import { nanoid } from "@/lib/utils";
import argon2 from "@node-rs/argon2";

const fileSizeLimit = Number(process.env.MAX_SIZE_LIMIT) || 10;
const pasteIdLength = Number(process.env.PASTE_ID_LENGTH) || 10;

const languageSchema = z.enum(languageValues);
const schema = zfd
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
    console.log(err);

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

  const supabase = createServiceServer();
  const id = nanoid(pasteIdLength);

  formData.adminPassword = !formData.adminPassword
    ? nanoid(16)
    : formData.adminPassword;

  const unhashedAdminPassword = formData.adminPassword;

  formData.adminPassword = await argon2.hash(formData.adminPassword);

  await supabase.storage
    .from("paste")
    .upload(`pastes/${id}.txt`, formData.file, {
      contentType: "text/plain",
    });

  await supabase.from("paste").insert({
    id,
    path: `pastes/${id}.txt`,
    admin_password: formData.adminPassword,
    language: formData.language,
  });

  return Response.json(
    {
      success: true,
      data: {
        id,
        password: unhashedAdminPassword,
      },
    },
    {
      status: 201,
    },
  );
}
