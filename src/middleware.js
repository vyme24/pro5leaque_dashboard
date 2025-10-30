import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Helper: verify token
  async function verifyJWT(token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch {
      return null;
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));

    const decoded = await verifyJWT(token);
    if (!decoded || decoded.role !== "admin") {
      const res = NextResponse.redirect(new URL("/auth/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login"],
};
