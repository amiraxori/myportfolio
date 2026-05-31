import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local BEFORE any module that reads process.env at import time
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch { /* .env.local not found, rely on existing env */ }

const DEFAULT_SERVICES = [
  {
    slug: 'static',
    name: 'Static Site',
    tagline: 'Fast, SEO-friendly marketing sites',
    startingPrice: 10000,
    currency: 'NPR',
    deliverables: ['5 Pages', 'Next.js + Tailwind', 'Basic SEO', 'Contact Form'],
    timeline: '1-2 Weeks',
    revisions: '2 rounds',
    upgradePaths: ['Dynamic + CMS', 'E-commerce'],
    order: 0,
  },
  {
    slug: 'dynamic-cms',
    name: 'Dynamic + CMS',
    tagline: 'Full control over your content',
    startingPrice: 25000,
    currency: 'NPR',
    deliverables: ['Unlimited Content', 'Admin Dashboard', 'Cloudinary Integration', 'Blog Support'],
    timeline: '3-4 Weeks',
    revisions: '3 rounds',
    upgradePaths: ['E-commerce'],
    order: 1,
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    tagline: 'Scalable online storefronts',
    startingPrice: 450000,
    currency: 'NPR',
    deliverables: ['Custom Shopping Cart', 'Admin Dashboard', 'Product Management', 'High Performance'],
    timeline: '8-12 Weeks',
    revisions: 'Unlimited',
    upgradePaths: [],
    order: 2,
  },
];

async function seed() {
  const { default: dbConnect } = await import('@/lib/db');
  const { default: Service } = await import('@/models/Service');

  await dbConnect();

  for (const data of DEFAULT_SERVICES) {
    const existing = await Service.findOne({ slug: data.slug });
    if (existing) {
      console.log(`Service "${data.name}" already exists, skipping.`);
    } else {
      await Service.create(data);
      console.log(`Created service: ${data.name}`);
    }
  }

  console.log('Done seeding services.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
