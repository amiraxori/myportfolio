import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { projectSchema } from '@/lib/validation/schemas';

export async function GET() {
  await dbConnect();
  const projects = await Project.find({}).sort({ order: 1 });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    await dbConnect();
    const project = await Project.create(validatedData);
    
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid data' }, { status: 400 });
  }
}
