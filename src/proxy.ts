import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only enforce auth on /admin paths
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = path === "/admin/login";
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);

  // Not authenticated — redirect to login (preserve intended destination)
  if (!session && !isLoginPage) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    if (path !== "/admin") {
      loginUrl.searchParams.set("from", path);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated — don't let them linger on the login page
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|svg|ico)$).*)"],
};
