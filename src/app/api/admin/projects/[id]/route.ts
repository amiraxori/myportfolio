import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { projectSchema } from '@/lib/validation/schemas';
import cloudinary from '@/lib/cloudinary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validatedData = projectSchema.partial().parse(body);
    
    await dbConnect();
    const project = await Project.findByIdAndUpdate(id, validatedData, { new: true });
    
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const project = await Project.findByIdAndDelete(id);
  if (project) {
    const toDelete = [
      project.coverImage?.publicId,
      ...(project.gallery || []).map((g: any) => g.publicId),
    ].filter(Boolean);
    await Promise.all(toDelete.map((pid: string) => cloudinary.uploader.destroy(pid).catch(() => {})));
  }
  return NextResponse.json({ success: true });
}
