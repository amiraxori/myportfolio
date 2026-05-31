import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatSession from '@/models/ChatSession';

export async function GET() {
  try {
    await dbConnect();
    const sessions = await ChatSession.find({}).sort({ lastMessageAt: -1 });
    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { sessionId, status, unreadCount } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await dbConnect();
    const session = await ChatSession.findOneAndUpdate(
      { sessionId },
      { 
        ...(status && { status }),
        ...(unreadCount !== undefined && { unreadCount })
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
