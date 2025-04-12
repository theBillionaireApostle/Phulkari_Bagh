// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// Ensure JWT_SECRET is defined in the environment
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to /admin/login or any other route that doesn't require auth
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

// - // Protect any route under /admin
// - if (pathname.startsWith("/admin")) {
// -   // Read the Authorization header (format: "Bearer <token>")
// -   const authHeader = request.headers.get("Authorization") || "";
// -   const token = authHeader.split(" ")[1];

// -   // If no token, redirect to /admin/login
// -   if (!token) {
// -     return NextResponse.redirect(new URL("/admin/login", request.url));
// -   }

// -   // Verify token
// -   try {
// -     jwt.verify(token, SECRET_KEY);
// -     // If valid, proceed
// -     return NextResponse.next();
// -   } catch (error) {
// -     // If invalid or expired, log and redirect to /admin/login
// -     console.error("JWT verification error:", error);
// -     return NextResponse.redirect(new URL("/admin/login", request.url));
// -   }
// - }

  // Allow all other routes
  return NextResponse.next();
}
