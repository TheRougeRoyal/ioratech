import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

type SqliteDatabase = Database.Database;

declare global {
  // eslint-disable-next-line no-var
  var __ioratechSqliteDb: SqliteDatabase | undefined;
  // eslint-disable-next-line no-var
  var __ioratechSqliteInitialized: boolean | undefined;
}

const DEFAULT_SQLITE_PATH = path.join(process.cwd(), 'data', 'ioratech.sqlite');
const SCHEMA_PATH = path.join(process.cwd(), 'migrations', '004_sqlite_auth_schema.sql');

function initializeSchema(db: SqliteDatabase): void {
  if (global.__ioratechSqliteInitialized) {
    return;
  }

  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schemaSql);
  global.__ioratechSqliteInitialized = true;
}

export function getDb(): SqliteDatabase {
  if (!global.__ioratechSqliteDb) {
    const configuredPath = process.env.SQLITE_DB_PATH?.trim();
    const dbPath = configuredPath && configuredPath.length > 0 ? configuredPath : DEFAULT_SQLITE_PATH;

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    global.__ioratechSqliteDb = db;
  }

  initializeSchema(global.__ioratechSqliteDb);
  return global.__ioratechSqliteDb;
}

export function nowIso(): string {
  return new Date().toISOString();
}
