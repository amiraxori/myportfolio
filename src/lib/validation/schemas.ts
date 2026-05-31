import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().min(1, 'Description is required'),
  tech: z.array(z.string()),
  coverImage: z.object({
    url: z.string().url(),
    publicId: z.string(),
  }),
  gallery: z.array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
    })
  ),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  impact: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.enum(['static', 'dynamic-cms', 'ecommerce']),
  tagline: z.string().min(1, 'Tagline is required'),
  startingPrice: z.number().min(0),
  currency: z.string().default('NPR'),
  deliverables: z.array(z.string()),
  timeline: z.string().min(1, 'Timeline is required'),
  revisions: z.string().min(1, 'Revisions is required'),
  upgradePaths: z.array(z.string()),
  order: z.number().default(0),
});

export const testimonialSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().optional(),
  quote: z.string().min(1, 'Quote is required'),
  avatar: z
    .object({
      url: z.string().url(),
      publicId: z.string(),
    })
    .optional(),
  rating: z.number().min(1).max(5).optional(),
  order: z.number().default(0),
});

export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  order: z.number().default(0),
});

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().optional(),
  package: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  source: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().min(1, 'Summary is required'),
  coverImage: z.object({
    url: z.string().url(),
    publicId: z.string(),
  }).optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  publishedAt: z.coerce.date().default(() => new Date()),
  author: z.string().default('Admin'),
});
