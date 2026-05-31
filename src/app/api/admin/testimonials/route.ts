import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { testimonialSchema } from '@/lib/validation/schemas';

export async function GET() {
  await dbConnect();
  const testimonials = await Testimonial.find({}).sort({ order: 1 });
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);
    await dbConnect();
    const testimonial = await Testimonial.create(validatedData);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
