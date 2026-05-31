import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatMessage from '@/models/ChatMessage';
import ChatSession from '@/models/ChatSession';
import { pusherServer } from '@/lib/pusher';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { sessionId, content, visitorName, visitorEmail } = await request.json();

    if (!sessionId || !content) {
      return NextResponse.json({ error: 'Session ID and content are required' }, { status: 400 });
    }

    await dbConnect();

    // Upsert session
    const session = await ChatSession.findOneAndUpdate(
      { sessionId },
      { 
        $set: { lastMessageAt: new Date() },
        $inc: { unreadCount: 1 },
        ...(visitorName && { visitorName }),
        ...(visitorEmail && { visitorEmail })
      },
      { upsert: true, returnDocument: 'after' }
    );

    const message = await ChatMessage.create({
      sessionId,
      sender: 'visitor',
      content,
    });

    // Trigger Pusher for Admin
    console.log(`Triggering Pusher for admin-chat with new-message for session: ${sessionId}`);
    await pusherServer.trigger('admin-chat', 'new-message', {
      message,
      session,
    });
    
    // Also trigger for the specific session (so other tabs for same visitor update)
    console.log(`Triggering Pusher for chat-${sessionId} with message: ${message._id}`);
    await pusherServer.trigger(`chat-${sessionId}`, 'message', message);

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
