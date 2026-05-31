import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget?: string;
  package?: string;
  message: string;
  source?: string;
  status: 'new' | 'contacted' | 'won' | 'lost';
  ip?: string;
  ua?: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    budget: { type: String },
    package: { type: String },
    message: { type: String, required: true },
    source: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'won', 'lost'], default: 'new' },
    ip: { type: String },
    ua: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
