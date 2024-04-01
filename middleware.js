import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// export { default } from "next-auth/middleware";
// protect everything

export default withAuth(
  function middleware(req) {
    console.log("withAuth pathname", req.nextUrl.pathname);
    console.log("withAuth role", req.nextauth);

    if (
      req.nextUrl.pathname.startsWith("/CreateUser") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/CreateUser"],
};
// protect CreateUser in middleware
