import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  coverImage: {
    url: string;
    publicId: string;
  };
  gallery: {
    url: string;
    publicId: string;
  }[];
  liveUrl?: string;
  repoUrl?: string;
  impact?: string;
  featured: boolean;
  order: number;
  publishedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    tech: [{ type: String }],
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    gallery: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    liveUrl: { type: String },
    repoUrl: { type: String },
    impact: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
