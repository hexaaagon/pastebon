"use server";
import { languageValues } from "@/config/code";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { absoluteUrl } from "../utils";

type ActionResult =
  | {
      success: true;
      data: unknown;
    }
  | { success: false; error: any };

const languageSchema = z.enum(languageValues);
const schema = zfd.formData({
  code: z.string(),
  adminPassword: z.string().nullish(),
  language: languageSchema.default("plaintext"),
});

export async function postCodeAction(form: FormData): Promise<ActionResult> {
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

  const paste = (await (
    await fetch(`//${absoluteUrl("/api/paste/create")}`, {
      method: "PUT",
      body: formData,
    })
  ).json()) as ActionResult;

  return paste;
}
