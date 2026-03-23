import { MongoClient } from 'mongodb';

type MongoDB = import('mongodb').Db;

declare global {
  // eslint-disable-next-line no-var
  var __ioratechMongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __ioratechMongoDb: MongoDB | undefined;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDb(): MongoDB {
  if (!global.__ioratechMongoDb) {
    const mongoUrl = getRequiredEnv('MONGO_URL');
    const dbName = getRequiredEnv('DB_NAME');

    if (!global.__ioratechMongoClient) {
      global.__ioratechMongoClient = new MongoClient(mongoUrl);
    }

    global.__ioratechMongoDb = global.__ioratechMongoClient.db(dbName);
  }

  return global.__ioratechMongoDb;
}

export function nowIso(): string {
  return new Date().toISOString();
}
