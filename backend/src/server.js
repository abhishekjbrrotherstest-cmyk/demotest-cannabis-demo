import dotenv from 'dotenv';
import app from './app.js';
import pool from './config/db.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

async function start() {
  try {
    await pool.query('SELECT 1');
    logger.info('Database connection OK');
  } catch (err) {
    logger.error('Database connection failed — is MySQL running and is backend/.env configured?');
    logger.error(err.message);
  }

  app.listen(PORT, () => {
    logger.info(`DemoTest Cannabis Co. API listening on http://localhost:${PORT}`);
    logger.info(`CORS allowed origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  });
}

start();