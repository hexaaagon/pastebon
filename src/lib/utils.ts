import { customAlphabet } from "nanoid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
);

export const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_ENV}`
  : undefined;

export function absoluteUrl(path: string = "/") {
  path = path.startsWith("/") ? path : `/${path}`;

  return `${process.env.NEXT_PUBLIC_APP_URL || vercelUrl || "https://pastebon.hexaa.lol"}${path}`;
}
