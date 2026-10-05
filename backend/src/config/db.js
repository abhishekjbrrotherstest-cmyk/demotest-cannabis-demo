import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { dbSslOptions } from './ssl.js';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'demotest_cannabis',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  dateStrings: false,
  ssl: dbSslOptions(),
});

export default pool;