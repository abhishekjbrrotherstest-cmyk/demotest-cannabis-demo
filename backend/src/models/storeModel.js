import pool from '../config/db.js';

const Store = {
  async findAll({ status } = {}) {
    const where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];
    const [rows] = await pool.query(
      `SELECT * FROM stores ${where} ORDER BY city`,
      params
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM stores WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM stores WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async findByIdOrSlug(value) {
    const [rows] = await pool.query(
      'SELECT * FROM stores WHERE id = ? OR slug = ? LIMIT 1',
      [value, String(value)]
    );
    return rows[0] || null;
  },

  async getHours(storeId) {
    const [rows] = await pool.query(
      'SELECT day_of_week, open_time, close_time FROM store_hours WHERE store_id = ? ORDER BY day_of_week',
      [storeId]
    );
    return rows;
  },

  async getHolidayHours(storeId) {
    const [rows] = await pool.query(
      'SELECT date, open_time, close_time, closed FROM store_holiday_hours WHERE store_id = ? ORDER BY date',
      [storeId]
    );
    return rows;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO stores
         (slug, name, address, city, state, zip, latitude, longitude, phone, email,
          description, image_url, dutchie_menu_id, dutchie_menu_url, google_maps_url,
          parking_info, accessibility_info, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.slug, data.name, data.address, data.city, data.state || 'PA', data.zip,
        data.latitude, data.longitude, data.phone || null, data.email || null,
        data.description || null, data.image_url || null, data.dutchie_menu_id || null,
        data.dutchie_menu_url || null, data.google_maps_url || null,
        data.parking_info || null, data.accessibility_info || null,
        data.status || 'active',
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'slug', 'name', 'address', 'city', 'state', 'zip', 'latitude', 'longitude', 'phone',
      'email', 'description', 'image_url', 'dutchie_menu_id', 'dutchie_menu_url',
      'google_maps_url', 'parking_info', 'accessibility_info', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE stores SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM stores WHERE id = ?', [id]);
  },

  async upsertHours(storeId, hours) {
    await pool.query('DELETE FROM store_hours WHERE store_id = ?', [storeId]);
    for (const h of hours) {
      await pool.query(
        `INSERT INTO store_hours (store_id, day_of_week, open_time, close_time)
         VALUES (?, ?, ?, ?)`,
        [storeId, h.day_of_week, h.open_time, h.close_time]
      );
    }
  },
};

export default Store;