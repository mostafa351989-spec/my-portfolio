import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. استثني صفحة اللوجين والـ API
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // 2. أي مسار تحت /admin لازم توكن
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = request.cookies.get('admin_token')?.value

    // مفيش توكن = ارميه على اللوجين فوراً
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // في توكن = اتأكد انه سليم
    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD_HASH!)
      await jwtVerify(token, secret)
      return NextResponse.next() // سليم، كمل
    } catch (error) {
      // بايظ او منتهي، امسحه وارجع للوجين
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  return NextResponse.next()
}

// ده اللي بيخلي الـ middleware يشتغل على /admin وكل اللي جواه
export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
