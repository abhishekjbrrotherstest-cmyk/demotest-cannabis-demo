import pool from '../config/db.js';

const FAQ = {
  async findAll({ status } = {}) {
    const where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];
    const [rows] = await pool.query(
      `SELECT * FROM faqs ${where} ORDER BY display_order ASC, id ASC`,
      params
    );
    return rows;
  },

  async findCategories() {
    const [rows] = await pool.query(
      "SELECT category, COUNT(*) AS total FROM faqs WHERE status = 'active' GROUP BY category ORDER BY category"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO faqs (question, answer, category, display_order, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.question, data.answer, data.category || 'General',
        data.display_order || 0, data.status || 'active',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = ['question', 'answer', 'category', 'display_order', 'status'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM faqs WHERE id = ?', [id]);
  },
};

export default FAQ;