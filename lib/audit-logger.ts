import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { logger } from './logger';

export interface AuditLog {
  action: string;
  actor: string; // userId
  resource: string; // what was accessed
  resourceId: string; // document ID
  changes?: Record<string, { before: any; after: any }>;
  result: 'success' | 'failure';
  errorMessage?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export async function createAuditLog(log: Omit<AuditLog, 'timestamp'>) {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      ...log,
      timestamp: Timestamp.now(),
      _indexed: true,
    });
  } catch (error) {
    // ponytail: critical failure, log to pino and throw
    logger.error({ error, log }, 'Audit log creation failed');
    throw new Error('Audit logging failed');
  }
}
