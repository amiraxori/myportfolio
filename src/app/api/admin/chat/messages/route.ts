import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const { sessionId, content } = await request.json();

    if (!sessionId || !content) {
      return NextResponse.json({ error: 'Session ID and content are required' }, { status: 400 });
    }

    await dbConnect();

    // Update session
    await ChatSession.findOneAndUpdate(
      { sessionId },
      { $set: { lastMessageAt: new Date() } },
      { returnDocument: 'after' }
    );

    const message = await ChatMessage.create({
      sessionId,
      sender: 'admin',
      content,
    });

    // Trigger Pusher for Visitor
    console.log(`Triggering Pusher for chat-${sessionId} with message:`, message._id);
    try {
      await pusherServer.trigger(`chat-${sessionId}`, 'message', message);
      console.log('Pusher trigger successful');
    } catch (pusherError) {
      console.error('Pusher trigger failed:', pusherError);
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
