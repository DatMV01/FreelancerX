import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  return NextResponse.next();

  // if (!token) {
  //   return NextResponse.redirect(new URL("/auth/signin", req.url));
  // }

  // const userRole = (token.user.role || "GUEST") as keyof typeof roleBasedAccess;

  // const roleBasedAccess = {
  //   ADMIN: ["/admin", "/dashboard", "/settings"],
  //   USER: ["/dashboard", "/profile"],
  //   REGISTERED: ["/dashboard", "/profile"],
  //   GUEST: ["/"],
  // };

  // const allowedPaths = roleBasedAccess[userRole] || [];
  // const isAuthorized = allowedPaths.some((path) => pathname.startsWith(path));

  // if (!isAuthorized) {
  //   return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*"],
};
