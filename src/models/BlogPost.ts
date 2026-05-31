import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string; // Tiptap JSON or HTML content
  summary: string;
  coverImage?: {
    url: string;
    publicId: string;
  };
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  author: string;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    coverImage: {
      url: { type: String },
      publicId: { type: String },
    },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    author: { type: String, default: 'Admin' },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
