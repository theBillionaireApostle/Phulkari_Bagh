// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Ensure JWT_SECRET is defined
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET must be set in the environment variables");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to /admin/login routes unconditionally
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Protect any route under /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_jwt")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Allow all other routes
  return NextResponse.next();
}
