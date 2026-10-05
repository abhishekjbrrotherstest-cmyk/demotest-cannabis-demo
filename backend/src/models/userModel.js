import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.status, u.last_login,
              u.created_at, u.store_id, r.id AS role_id, r.name AS role_name
         FROM users u
         JOIN roles r ON r.id = u.role_id
        ORDER BY u.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.status, u.last_login,
              u.created_at, u.store_id, r.id AS role_id, r.name AS role_name
         FROM users u
         JOIN roles r ON r.id = u.role_id
        WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT u.*, r.name AS role_name
         FROM users u
         JOIN roles r ON r.id = u.role_id
        WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  async create({ first_name, last_name, email, phone, password, role_id, store_id = null, status = 'active' }) {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role_id, store_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone || null, password_hash, role_id, store_id, status]
    );
    return this.findById(result.insertId);
  },

  async updatePassword(userId, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);
  },

  async touchLastLogin(id) {
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
  },
};

export default User;