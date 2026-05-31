/** @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encrypt, decrypt, SessionPayload } from '../auth';

describe('Auth Utilities', () => {
  const mockPayload: SessionPayload = {
    role: 'admin',
    userId: '123'
  };

  it('encrypts and decrypts a payload successfully', async () => {
    const token = await encrypt(mockPayload);
    expect(typeof token).toBe('string');
    
    const decrypted = await decrypt(token);
    expect(decrypted.role).toBe(mockPayload.role);
    expect(decrypted.userId).toBe(mockPayload.userId);
  });

  it('fails to decrypt invalid token', async () => {
    await expect(decrypt('invalid.token.string')).rejects.toThrow();
  });
});
