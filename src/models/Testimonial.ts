import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  author: string;
  role: string;
  company?: string;
  quote: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  rating?: number;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    author: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String },
    quote: { type: String, required: true },
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
    rating: { type: Number, min: 1, max: 5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
