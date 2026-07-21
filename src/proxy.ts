import { NextResponse, type NextRequest } from 'next/server'

// TODO: Re-enable auth — magic link + Resend SMTP or PKCE flow
// Auth is temporarily disabled while we sort out email delivery
export async function proxy(request: NextRequest) {
  // Skip login page while auth is temporarily disabled.
  if (request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/studio'
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
