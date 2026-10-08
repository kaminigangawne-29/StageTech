import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect TECHNICIAN trying to access company-only pages
    if (token?.role === 'TECHNICIAN' && pathname.startsWith('/company')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect PRODUCTION trying to access technician-only pages
    if (token?.role === 'PRODUCTION' && pathname.startsWith('/portfolio')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (token?.role === 'PRODUCTION' && pathname.startsWith('/history')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/portfolio/:path*',
    '/history/:path*',
    '/company/:path*',
    '/messages/:path*',
  ],
}
