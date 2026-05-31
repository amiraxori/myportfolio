import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: string;
  sender: 'visitor' | 'admin';
  content: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['visitor', 'admin'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
