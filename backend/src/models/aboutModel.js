import pool from '../config/db.js';

const AboutSection = {
  async findActive() {
    const [rows] = await pool.query(
      `SELECT * FROM about_sections WHERE status = 'active' ORDER BY display_order ASC, id ASC`
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM about_sections ORDER BY display_order ASC, id ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM about_sections WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO about_sections (section_type, title, subtitle, content, image_url, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.section_type || 'story', data.title || null, data.subtitle || null,
        data.content || null, data.image_url || null, data.display_order || 0,
        data.status || 'active',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'section_type', 'title', 'subtitle', 'content', 'image_url', 'display_order', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE about_sections SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM about_sections WHERE id = ?', [id]);
  },
};

export default AboutSection;