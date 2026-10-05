import pool from '../config/db.js';

const Banners = {
  async findActive() {
    const [rows] = await pool.query(
      `SELECT * FROM hero_banners WHERE status = 'active' ORDER BY display_order ASC, id ASC`
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM hero_banners ORDER BY display_order ASC, id ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM hero_banners WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO hero_banners
         (title, subtitle, image_url, mobile_image_url, cta_primary_text, cta_primary_link,
          cta_secondary_text, cta_secondary_link, overlay_opacity, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.subtitle || null, data.image_url, data.mobile_image_url || null,
        data.cta_primary_text || null, data.cta_primary_link || null,
        data.cta_secondary_text || null, data.cta_secondary_link || null,
        data.overlay_opacity ?? 55, data.display_order || 0, data.status || 'active',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'title', 'subtitle', 'image_url', 'mobile_image_url', 'cta_primary_text',
      'cta_primary_link', 'cta_secondary_text', 'cta_secondary_link',
      'overlay_opacity', 'display_order', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE hero_banners SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM hero_banners WHERE id = ?', [id]);
  },
};

const Sections = {
  async findActive() {
    const [rows] = await pool.query(
      `SELECT * FROM home_sections WHERE status = 'active' ORDER BY display_order ASC, id ASC`
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT * FROM home_sections ORDER BY display_order ASC, id ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM home_sections WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO home_sections
         (section_key, title, subtitle, description, image_url, cta_text, cta_link,
          background_color, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.section_key, data.title || null, data.subtitle || null, data.description || null,
        data.image_url || null, data.cta_text || null, data.cta_link || null,
        data.background_color || 'brand', data.display_order || 0, data.status || 'active',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'section_key', 'title', 'subtitle', 'description', 'image_url', 'cta_text',
      'cta_link', 'background_color', 'display_order', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE home_sections SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM home_sections WHERE id = ?', [id]);
  },
};

export { Banners, Sections };