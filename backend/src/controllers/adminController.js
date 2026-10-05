import pool from '../config/db.js';
import AuditLog from '../models/auditLogModel.js';
import logger from '../utils/logger.js';

// GET /api/admin/dashboard
export async function dashboard(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users)                    AS users,
        (SELECT COUNT(*) FROM stores WHERE status='active') AS stores,
        (SELECT COUNT(*) FROM blog_posts)               AS posts,
        (SELECT COUNT(*) FROM faqs)                     AS faqs,
        (SELECT COUNT(*) FROM careers WHERE status='open') AS careers,
        (SELECT COUNT(*) FROM contact_messages)         AS messages
    `);
    const stats = rows[0];

    const [recentContacts] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5'
    );
    const auditLogs = await AuditLog.findAll({ limit: 15 });

    logger.info(`Dashboard fetched by ${req.user.email}`);
    res.json({ stats, recentContacts, auditLogs });
  } catch (err) {
    next(err);
  }
}