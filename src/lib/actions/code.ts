"use server";
import { languageValues } from "@/config/code";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { createSchema, pasteIdLength } from "@/lib/constants";

import { createServiceServer } from "../supabase/service-server";
import { nanoid } from "@/lib/utils";
import argon2 from "@node-rs/argon2";

type ActionResult<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | { success: false; error: any };

const languageSchema = z.enum(languageValues);
const schema = zfd.formData({
  code: z.string(),
  adminPassword: z.string().nullish(),
  language: languageSchema.default("plaintext"),
});

export async function postCodeAction(
  form: FormData,
): Promise<ActionResult<{ id: string; password: string }>> {
  let data: typeof schema._type;

  try {
    data = schema.parse(form);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        success: false,
        error: err.flatten().fieldErrors,
      };
    } else {
      return {
        success: false,
        error: err,
      };
    }
  }

  const formData = new FormData();
  formData.append(
    "file",
    new File([data.code], "code.txt", { type: "text/plain" }),
  );
  formData.append("language", data.language);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  data.adminPassword && formData.append("adminPassword", data.adminPassword);

  const code = await createCode(createSchema.parse(formData));

  return code;
}

export async function createCode(
  formData: typeof createSchema._type,
): Promise<ActionResult<{ id: string; password: string }>> {
  const supabase = createServiceServer();
  const id = nanoid(pasteIdLength);

  formData.adminPassword = !formData.adminPassword
    ? nanoid(16)
    : formData.adminPassword;

  const unhashedAdminPassword = formData.adminPassword;

  formData.adminPassword = await argon2.hash(formData.adminPassword);

  if (formData.options) {
    formData.options.accessPassword =
      formData.options.accessPassword &&
      (await argon2.hash(formData.options.accessPassword));
  }

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

    max_views: formData.options?.maxViews,
    expires_at: formData.options?.expiresAt,
    access_password: formData.options?.accessPassword,
  });

  return {
    success: true,
    data: {
      id,
      password: unhashedAdminPassword,
    },
  };
}

export async function viewCode({
  id,
  accessPassword,
}: {
  id: string;
  accessPassword?: string;
}): Promise<
  ActionResult<{
    paste: string;
    language: string;
    views: number;
    createdAt: string;
    expiresAt: string;
  }>
> {
  const supabase = createServiceServer();
  const pasteDatabase = await supabase
    .from("paste")
    .select("*")
    .eq("id", id)
    .single();

  if (pasteDatabase.error)
    return {
      success: false,
      error: pasteDatabase.error.message,
    };

  if (
    pasteDatabase.data.expires_at &&
    new Date() > new Date(pasteDatabase.data.expires_at)
  )
    return {
      success: false,
      error: "Paste has expired",
    };

  if (pasteDatabase.data.access_password) {
    if (!accessPassword)
      return {
        success: false,
        error: "Access password required",
      };

    const validAccessPassword = await argon2.verify(
      pasteDatabase.data.access_password,
      accessPassword,
    );

    if (!validAccessPassword)
      return {
        success: false,
        error: "Invalid access password",
      };
  }

  const pasteData = await supabase.storage
    .from("paste")
    .download(pasteDatabase.data.path);

  if (pasteData.error)
    return {
      success: false,
      error: "No file found",
    };

  const paste = await pasteData.data.text();

  await supabase
    .from("paste")
    .update({ views: (pasteDatabase.data.views || 0) + 1 })
    .eq("id", id);

  return {
    success: true,
    data: {
      paste,
      language: pasteDatabase.data.language || "plaintext",
      views: (pasteDatabase.data.views || 0) + 1,
      createdAt: pasteDatabase.data.created_at!,
      expiresAt: pasteDatabase.data.expires_at!,
    },
  };
}
