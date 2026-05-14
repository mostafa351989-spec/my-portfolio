import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { password } = await request.json()
  const hash = process.env.ADMIN_PASSWORD_HASH!
  
  const isValid = await bcrypt.compare(password, hash)
  if (!isValid) return NextResponse.json({ error: 'Invalid' }, { status: 401 })

  const secret = new TextEncoder().encode(hash)
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', token, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict',
    path: '/'
  })
  return res
}
