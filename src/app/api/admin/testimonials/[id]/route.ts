import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { testimonialSchema } from '@/lib/validation/schemas';
import cloudinary from '@/lib/cloudinary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(testimonial);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = testimonialSchema.partial().parse(body);
    await dbConnect();
    const testimonial = await Testimonial.findByIdAndUpdate(id, validatedData, { new: true });
    return NextResponse.json(testimonial);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (testimonial?.avatar?.publicId) {
    await cloudinary.uploader.destroy(testimonial.avatar.publicId).catch(() => {});
  }
  return NextResponse.json({ message: 'Deleted' });
}
