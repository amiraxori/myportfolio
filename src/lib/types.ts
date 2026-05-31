export interface IProjectClient {
  _id: string;
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
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IServiceClient {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ITestimonialClient {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface IFaqClient {
  _id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ILeadClient {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}
