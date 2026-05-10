import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Project from '@/lib/models/Project';
export async function GET() { await dbConnect(); const projects = await Project.find(); return NextResponse.json(projects); }
export async function POST(req: Request) { await dbConnect(); const data = await req.json(); const project = await Project.create(data); return NextResponse.json(project); }
