import pool from '../config/db.js';

const Career = {
  async findAll({ status } = {}) {
    const where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];
    const [rows] = await pool.query(
      `SELECT * FROM careers ${where} ORDER BY created_at DESC`,
      params
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM careers WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO careers (title, location, employment_type, description, requirements, responsibilities, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.location, data.employment_type || 'Full-time',
        data.description || null, data.requirements || null,
        data.responsibilities || null, data.status || 'open',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'title', 'location', 'employment_type', 'description',
      'requirements', 'responsibilities', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE careers SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM careers WHERE id = ?', [id]);
  },

  async addApplication({ career_id, first_name, last_name, email, phone, resume_url, cover_letter }) {
    const [result] = await pool.query(
      `INSERT INTO job_applications
         (career_id, first_name, last_name, email, phone, resume_url, cover_letter)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [career_id, first_name, last_name, email, phone || null, resume_url || null, cover_letter || null]
    );
    return result.insertId;
  },

  async countApplications(careerId) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total FROM job_applications WHERE career_id = ?',
      [careerId]
    );
    return rows[0].total;
  },
};

export default Career;