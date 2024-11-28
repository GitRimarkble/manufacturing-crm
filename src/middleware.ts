import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // Maximum requests per window
const LOGIN_MAX_REQUESTS = 5 // Stricter limit for login attempts

function getRateLimitConfig(path: string) {
  if (path === '/login' || path === '/api/auth/callback/credentials') {
    return LOGIN_MAX_REQUESTS
  }
  return MAX_REQUESTS
}

function isRateLimited(ip: string, path: string): boolean {
  const now = Date.now()
  const maxRequests = getRateLimitConfig(path)
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return false
  }

  const rateLimitInfo = rateLimit.get(ip)!

  if (now > rateLimitInfo.resetTime) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return false
  }

  rateLimitInfo.count++
  rateLimit.set(ip, rateLimitInfo)

  return rateLimitInfo.count > maxRequests
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, info] of rateLimit.entries()) {
    if (now > info.resetTime) {
      rateLimit.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW)

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Get IP for rate limiting
  const ip = request.ip ?? 'anonymous'
  
  // Check rate limit
  if (isRateLimited(ip, path)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'Content-Type': 'text/plain',
      },
    })
  }

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register'

  // Get the token and convert to boolean
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Security headers
  const headers = new Headers(request.headers)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSRF protection for mutation endpoints
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin')
    const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL]
    
    if (!origin || !allowedOrigins.includes(origin)) {
      return new NextResponse('Invalid Origin', { status: 403 })
    }
  }

  // Redirect logic
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !token) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    return response
  }

  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  // Add security headers to response
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /favicon.ico, /site.webmanifest (public files)
     */
    '/((?!api/auth|_next|fonts|favicon.ico|site.webmanifest).*)',
  ],
}
