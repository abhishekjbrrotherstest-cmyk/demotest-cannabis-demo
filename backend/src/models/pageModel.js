import pool from '../config/db.js';

const Page = {
  async findAll({ status } = {}) {
    const where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];
    const [rows] = await pool.query(
      `SELECT id, title, slug, hero_image_url, seo_title, meta_description, og_image, status, updated_at
       FROM pages ${where} ORDER BY title ASC`,
      params
    );
    return rows;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT * FROM pages WHERE slug = ? AND status = 'published'`,
      [slug]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM pages WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO pages (title, slug, content, hero_image_url, seo_title, meta_description, og_image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.slug, data.content || null, data.hero_image_url || null,
        data.seo_title || null, data.meta_description || null, data.og_image || null,
        data.status || 'published',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'title', 'slug', 'content', 'hero_image_url', 'seo_title', 'meta_description', 'og_image', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE pages SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM pages WHERE id = ?', [id]);
  },

  async publish(id, status = 'published') {
    await pool.query('UPDATE pages SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  },
};

export default Page;