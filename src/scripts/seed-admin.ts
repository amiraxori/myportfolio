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

// Dynamic imports so db.ts is evaluated AFTER env vars are set above
async function seed() {
  const { default: bcrypt } = await import('bcryptjs');
  const { default: dbConnect } = await import('@/lib/db');
  const { default: User } = await import('@/models/User');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    process.exit(1);
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: 'admin' });

  console.log('Admin user created successfully');
  process.exit(0);
}

seed().catch(console.error);
