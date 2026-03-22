import crypto from 'crypto';

const SCRYPT_KEY_LEN = 64;
const PASSWORD_HASH_PREFIX = 'scrypt';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEY_LEN).toString('hex');
  return `${PASSWORD_HASH_PREFIX}$${salt}$${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  try {
    const [prefix, salt, storedHash] = passwordHash.split('$');

    if (prefix !== PASSWORD_HASH_PREFIX || !salt || !storedHash) {
      return false;
    }

    const computedHash = crypto.scryptSync(password, salt, SCRYPT_KEY_LEN).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(computedHash, 'hex'));
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export function generateSecureToken(bytes: number = 48): string {
  return crypto.randomBytes(bytes).toString('base64url');
}
