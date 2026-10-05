import pool from '../config/db.js';

const AuditLog = {
  async write({ user_id, action, entity = null, entity_id = null, ip_address = null }) {
    const [result] = await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, ip_address)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id || null, action, entity, entity_id !== undefined && entity_id !== null ? String(entity_id) : null, ip_address || null]
    );
    return result.insertId;
  },

  async findAll({ limit = 100 } = {}) {
    const [rows] = await pool.query(
      `SELECT al.*, u.email AS user_email
         FROM audit_logs al
         LEFT JOIN users u ON u.id = al.user_id
        ORDER BY al.created_at DESC
        LIMIT ?`,
      [Number(limit)]
    );
    return rows;
  },
};

export default AuditLog;