import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // 1. سيب صفحة اللوجين والـ API يعدوا عادي
  if (request.nextUrl.pathname === '/admin/login' || 
      request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 2. أي حاجة جوه /admin لازم نتأكد منها
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    // لو مفيش توكن، ارميه على اللوجين
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // لازم الـ secret يكون نفس اللي في API بالظبط
      const hash = process.env.ADMIN_PASSWORD_HASH!
      const secret = new TextEncoder().encode(hash)
      await jwtVerify(token, secret) // لو فشل هيرمي error
      return NextResponse.next() // لو نجح كمل عادي
    } catch (err) {
      // لو التوكن بايظ او منتهي، امسحه وارجع للوجين
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
}
