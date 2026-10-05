import pool from '../config/db.js';

const Event = {
  async findByStore(storeId, { upcoming = false } = {}) {
    const where = upcoming ? 'AND event_date >= CURDATE()' : '';
    const [rows] = await pool.query(
      `SELECT id, title, description, event_date, start_time, end_time, location_detail,
              register_url, status
       FROM store_events WHERE store_id = ? ${where} ORDER BY event_date ASC, start_time ASC`,
      [storeId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM store_events WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO store_events
         (store_id, title, description, event_date, start_time, end_time, location_detail, register_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.store_id, data.title, data.description || null, data.event_date,
        data.start_time || null, data.end_time || null, data.location_detail || null,
        data.register_url || null, data.status || 'open',
      ]
    );
    return this.findById(result.insertId);
  },

  async remove(id) {
    await pool.query('DELETE FROM store_events WHERE id = ?', [id]);
  },
};

export default Event;