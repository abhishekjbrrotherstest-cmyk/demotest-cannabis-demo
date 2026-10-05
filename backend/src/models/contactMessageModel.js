import pool from '../config/db.js';

const ContactMessage = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT cm.*, s.name AS store_name
         FROM contact_messages cm
         LEFT JOIN stores s ON s.id = cm.store_id
        ORDER BY cm.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, phone, store_id, subject, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.first_name, data.last_name, data.email, data.phone || null,
        data.store_id || null, data.subject, data.message,
      ]
    );
    return this.findById(result.insertId);
  },

  async remove(id) {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
  },
};

export default ContactMessage;