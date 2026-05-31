import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Faq from '@/models/Faq';
import { faqSchema } from '@/lib/validation/schemas';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const faq = await Faq.findById(id);
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(faq);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = faqSchema.partial().parse(body);
    await dbConnect();
    const faq = await Faq.findByIdAndUpdate(id, validatedData, { new: true });
    return NextResponse.json(faq);
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
  await Faq.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
