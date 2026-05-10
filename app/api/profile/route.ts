import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/lib/models/User';
export async function GET() { await dbConnect(); const user = await User.findOne(); return NextResponse.json(user); }
export async function PUT(req: Request) { await dbConnect(); const data = await req.json(); const user = await User.findOneAndUpdate({}, data, { new: true, upsert: true }); return NextResponse.json(user); }
