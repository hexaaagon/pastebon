import type { SupabaseClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import pasteHandler from "./paste-handler";

const middlewares: ((
  req: NextRequest,
  res: NextResponse,
  supabase: SupabaseClient,
) => Promise<NextResponse | void> | void)[] = [pasteHandler];

export default async function middleware(
  req: NextRequest,
  res: NextResponse,
  supabase: SupabaseClient,
) {
  // Load individuals middleware
  for (const func of middlewares) {
    const response = await func(req, res, supabase);
    if (response) return response;
  }

  return res;
}
