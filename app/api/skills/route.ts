export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Skill from '@/lib/models/Skill';
export async function GET() { await dbConnect(); const skills = await Skill.find(); return NextResponse.json(skills); }
export async function POST(req: Request) { await dbConnect(); const data = await req.json(); const skill = await Skill.create(data); return NextResponse.json(skill); }
