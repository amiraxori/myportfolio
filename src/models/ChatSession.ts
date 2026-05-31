import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
  sessionId: string;
  visitorName?: string;
  visitorEmail?: string;
  lastMessageAt: Date;
  status: 'active' | 'archived';
  unreadCount: number;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    visitorName: { type: String },
    visitorEmail: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
