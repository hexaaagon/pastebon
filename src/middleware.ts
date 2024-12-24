import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
	return createClient(request);
}

export const config = {
	matcher:
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|static).*)",
};