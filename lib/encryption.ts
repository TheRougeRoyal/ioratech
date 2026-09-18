import crypto from 'crypto';
import { env } from './env';

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(
  env.API_KEY_HASH_SECRET, // Using a stable secret from env
  'salt',
  32
);

export function encryptField(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptField(encrypted: string): string {
  const [ivHex, authTagHex, encryptedData] = encrypted.split(':');
  if (!ivHex || !authTagHex || !encryptedData) throw new Error('Invalid encrypted data format');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
