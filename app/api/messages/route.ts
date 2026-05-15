export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Message from '@/lib/models/Message';
export async function GET() { await dbConnect(); const messages = await Message.find().sort({ createdAt: -1 }); return NextResponse.json(messages); }
export async function POST(req: Request) { await dbConnect(); const { email, message } = await req.json(); const msg = await Message.create({ email, message }); return NextResponse.json(msg); }
