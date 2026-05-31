import { describe, it, expect } from 'vitest';
import { 
  projectSchema, 
  serviceSchema, 
  testimonialSchema, 
  faqSchema, 
  leadSchema, 
  loginSchema 
} from '../schemas';

describe('Zod Schemas', () => {
  describe('projectSchema', () => {
    it('validates a valid project', () => {
      const validProject = {
        title: 'Test Project',
        slug: 'test-project',
        summary: 'A test project',
        description: 'Detailed description',
        tech: ['React', 'Next.js'],
        coverImage: { url: 'https://example.com/img.jpg', publicId: '123' },
        gallery: [],
        featured: true,
        order: 1
      };
      const result = projectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('rejects invalid urls', () => {
      const invalidProject = {
        title: 'Test', slug: 'test', summary: 'test', description: 'test',
        tech: [],
        coverImage: { url: 'not-a-url', publicId: '123' },
        gallery: []
      };
      const result = projectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });
  });

  describe('serviceSchema', () => {
    it('validates a valid service', () => {
      const validService = {
        name: 'Basic Site',
        slug: 'static',
        tagline: 'Simple site',
        startingPrice: 1000,
        deliverables: ['1 page'],
        timeline: '1 week',
        revisions: '1',
        upgradePaths: []
      };
      const result = serviceSchema.safeParse(validService);
      expect(result.success).toBe(true);
    });

    it('rejects invalid enum slug', () => {
      const result = serviceSchema.safeParse({
        name: 'Basic', slug: 'invalid-slug', tagline: 't', startingPrice: 10,
        deliverables: [], timeline: 't', revisions: 'r', upgradePaths: []
      });
      expect(result.success).toBe(false);
    });
  });

  describe('leadSchema', () => {
    it('validates valid lead', () => {
      const validLead = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello'
      };
      const result = leadSchema.safeParse(validLead);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = leadSchema.safeParse({
        name: 'John',
        email: 'not-an-email',
        message: 'Hello'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('validates valid login', () => {
      const result = loginSchema.safeParse({ email: 'admin@example.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('rejects short password', () => {
      const result = loginSchema.safeParse({ email: 'admin@example.com', password: '123' });
      expect(result.success).toBe(false);
    });
  });
});
