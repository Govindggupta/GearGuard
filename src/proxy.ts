import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const proxy = async (req: NextRequest) => {
  const token = await getToken({ req: req });
  const url = req.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/signin") || url.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin"));
    }
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/signin", "/signup", "/", "/dashboard", "/dashboard/:path*"],
};
