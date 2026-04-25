import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'algo_auth'
const LOGIN_PATH = '/login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === LOGIN_PATH || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const sitePassword = process.env.SITE_PASSWORD
  if (!sitePassword) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get(COOKIE_NAME)
  if (authCookie?.value === sitePassword) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = LOGIN_PATH
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
