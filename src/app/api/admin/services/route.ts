import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { serviceSchema } from '@/lib/validation/schemas';

export async function GET() {
  await dbConnect();
  const services = await Service.find({}).sort({ order: 1 });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = serviceSchema.parse(body);
    await dbConnect();
    const service = await Service.create(validatedData);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
