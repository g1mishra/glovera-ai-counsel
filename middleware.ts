import { isProfileComplete } from "@/utils/profile";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!isProfileComplete(token.profile)) {
    const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
    if (!isAuthRoute && request.nextUrl.pathname !== "/onboard") {
      return NextResponse.redirect(new URL("/onboard", request.url));
    }
  } else {
    if (request.nextUrl.pathname.startsWith("/onboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/get-started/:path*", "/profile/:path*", "/programs/:path*", "/onboard/:path*"],
};
