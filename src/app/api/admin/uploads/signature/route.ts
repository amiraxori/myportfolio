import { NextResponse } from 'next/server';
import { generateSignature } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;
    
    const signature = generateSignature(paramsToSign);
    
    return NextResponse.json({
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_NAME,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
