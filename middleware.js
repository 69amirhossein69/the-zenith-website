// import { NextResponse } from "next/server";

// export function middleware(request) {

//   return NextResponse.redirect();
// }

import { auth } from "@/app/_lib/auth";
export const middleware = auth;
export const config = {
  matcher: ["/account"],
};
