import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return Response.redirect(new URL(`/paste/${id}`, request.url), 307);
}
