export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { cookies } from 'next/headers';
export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 401 });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 401 });
  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  cookies().set('token', token, { httpOnly: true, secure: false, path: '/', maxAge: 60*60*24*7 });
  return NextResponse.json({ success: true });
}
