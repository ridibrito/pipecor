import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - important for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // If no session and user is trying to access protected routes, redirect to login
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, if you have a public home page)
     * - auth routes (/login, /signup)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|signup|auth).*)',
  ],
}