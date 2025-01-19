import { z } from "zod";
import { zfd } from "zod-form-data";
import { languageValues } from "@/config/code";

export const fileSizeLimit = Number(process.env.MAX_SIZE_LIMIT) || 10;
export const pasteIdLength = Number(process.env.PASTE_ID_LENGTH) || 10;

const languageSchema = z.enum(languageValues);
export const createSchema = zfd
  .formData({
    file: zfd.file(),
    adminPassword: z.string().nullish(),
    language: languageSchema.default("plaintext"),
    options: z
      .object({
        expiresAt: z.string().optional(),
        accessPassword: z.string().optional(),
        maxViews: z.number().int().optional(),
      })
      .nullish(),
  })
  .refine((args) => args.file.size <= fileSizeLimit * 1024 * 1024, {
    message: `File size should not exceed ${fileSizeLimit}MB`,
  });

export enum ErrorPages {
  NotFound = "/error-pages/not-found",

  PasteNotFound = "/error-pages/paste-not-found",
  PasteExpired = "/error-pages/paste-expired",
}
