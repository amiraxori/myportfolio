import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  slug: 'static' | 'dynamic-cms' | 'ecommerce';
  name: string;
  tagline: string;
  startingPrice: number;
  currency: string;
  deliverables: string[];
  timeline: string;
  revisions: string;
  upgradePaths: string[];
  order: number;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, enum: ['static', 'dynamic-cms', 'ecommerce'] },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currency: { type: String, default: 'NPR' },
    deliverables: [{ type: String }],
    timeline: { type: String, required: true },
    revisions: { type: String, required: true },
    upgradePaths: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
