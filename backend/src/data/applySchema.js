import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { dbSslOptions } from '../config/ssl.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, '..', '..', 'schema.sql');

/**
 * Applies schema.sql to the configured database.
 * Every statement is CREATE TABLE IF NOT EXISTS / SET, so it is safe to re-run.
 * Usage: npm run db:schema
 */
async function main() {
  const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'demotest_cannabis',
    multipleStatements: true,
    ssl: dbSslOptions(),
  });

  try {
    console.log(`Applying schema to ${process.env.DB_NAME || 'demotest_cannabis'} @ ${process.env.DB_HOST || 'localhost'} …`);
    await conn.query(sql);
    console.log('Schema applied successfully.');
    console.log('Next: npm run seed');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Schema failed:', err.message);
  process.exit(1);
});
