import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE_NAME = "auth"
const LOGIN_PATH = "/login"
const DASHBOARD_PATH = "/"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === "1"

  if (pathname === DASHBOARD_PATH && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  if (pathname === LOGIN_PATH && isAuthenticated) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login"],
}
