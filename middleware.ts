import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isUserPage = pathname.startsWith("/dashboard/user");
  const isAdminPage = pathname.startsWith("/dashboard/admin");

  // Belum login, tapi akses halaman dashboard
  if (!token && (isUserPage || isAdminPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sudah login, tapi akses halaman login/register
  if (token && isAuthPage) {
    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/dashboard/admin/artikel", request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL("/dashboard/user/artikel", request.url)
      );
    }
  }

  return NextResponse.next();
}

// Jalankan middleware hanya untuk path tertentu
export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
