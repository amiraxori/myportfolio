import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { leadSchema } from '@/lib/validation/schemas';
import { sendLeadEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple Honeypot check (if we had a 'website' field that should be empty)
    if (body.website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    const validatedData = leadSchema.parse(body);
    
    await dbConnect();
    const lead = await Lead.create({
      ...validatedData,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      ua: request.headers.get('user-agent') || 'unknown',
    });
    
    await sendLeadEmail(lead);
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 400 });
  }
}
