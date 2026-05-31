import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Faq from '@/models/Faq';
import { faqSchema } from '@/lib/validation/schemas';

export async function GET() {
  await dbConnect();
  const faqs = await Faq.find({}).sort({ order: 1 });
  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = faqSchema.parse(body);
    await dbConnect();
    const faq = await Faq.create(validatedData);
    return NextResponse.json(faq, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
