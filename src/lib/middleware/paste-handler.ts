import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { createServiceServer } from "../supabase/service-server";
import { ErrorPages } from "../constants";

const whitelistSuffix = ["/raw"];

export default async function pasteHandler(
  req: NextRequest,
  res: NextResponse,
  supaClient: SupabaseClient,
) {
  if (!req.nextUrl.pathname.startsWith("/paste/")) return;
  let pasteId = req.nextUrl.pathname.replace("/paste/", "");

  for (const suffix of whitelistSuffix) {
    pasteId = pasteId.endsWith(suffix) ? pasteId.replace(suffix, "") : pasteId;
  }

  const pasteExist = await isPasteExists(pasteId);

  if (pasteExist) return;

  const nextUrl = req.nextUrl.clone();
  nextUrl.pathname = ErrorPages.NoPasteFound;

  return NextResponse.rewrite(nextUrl);
}

export async function isPasteExists(id: string) {
  const supabase = createServiceServer();
  const pasteDatabase = await supabase
    .from("paste")
    .select("*")
    .eq("id", id)
    .single();

  if (pasteDatabase.error) return false;

  const pasteData = await supabase.storage
    .from("paste")
    .exists(pasteDatabase.data.path);

  if (pasteData.error) return false;

  return true;
}
