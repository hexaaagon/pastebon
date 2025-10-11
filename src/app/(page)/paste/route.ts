import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return Response.redirect(new URL(`/pastes`, request.url), 307);
}
