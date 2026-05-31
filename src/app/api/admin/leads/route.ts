import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';

export async function GET() {
  await dbConnect();
  const leads = await Lead.find({}).sort({ createdAt: -1 });
  return NextResponse.json(leads);
}
