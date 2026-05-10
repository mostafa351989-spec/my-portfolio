import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Project from '@/lib/models/Project';
import Message from '@/lib/models/Message';
import Skill from '@/lib/models/Skill';
export async function GET() { await dbConnect(); const projects = await Project.countDocuments(); const messages = await Message.countDocuments(); const skills = await Skill.countDocuments(); return NextResponse.json({ projects, messages, skills }); }
