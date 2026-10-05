import pool from '../config/db.js';

const Menu = {
  async findAllMenus() {
    const [rows] = await pool.query('SELECT * FROM menus ORDER BY id ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM menus WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByKey(key) {
    const [rows] = await pool.query('SELECT * FROM menus WHERE key_name = ?', [key]);
    return rows[0] || null;
  },

  async findItemsByMenu(menuId, { status } = {}) {
    if (status) {
      const [rows] = await pool.query(
        'SELECT * FROM menu_items WHERE menu_id = ? AND status = ? ORDER BY sort_order ASC, id ASC',
        [menuId, status]
      );
      return rows;
    }
    const [rows] = await pool.query(
      'SELECT * FROM menu_items WHERE menu_id = ? ORDER BY sort_order ASC, id ASC',
      [menuId]
    );
    return rows;
  },

  // Active menus with their active items — used by the public /menus endpoint.
  async findAllWithItems() {
    const menus = await this.findAllMenus();
    const result = [];
    for (const menu of menus) {
      result.push({
        ...menu,
        items: menu.status === 'active' ? await this.findItemsByMenu(menu.id, { status: 'active' }) : [],
      });
    }
    return result;
  },

  async createMenu(data) {
    const [result] = await pool.query(
      'INSERT INTO menus (key_name, label, status) VALUES (?, ?, ?)',
      [data.key_name, data.label || data.key_name, data.status || 'active']
    );
    return this.findById(result.insertId);
  },

  async updateMenu(id, data) {
    const fields = [];
    const params = [];
    const allowed = ['key_name', 'label', 'status'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE menus SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async removeMenu(id) {
    await pool.query('DELETE FROM menus WHERE id = ?', [id]);
  },

  async createItem(data) {
    const [result] = await pool.query(
      'INSERT INTO menu_items (menu_id, label, url, sort_order, status) VALUES (?, ?, ?, ?, ?)',
      [data.menu_id, data.label, data.url || '/', data.sort_order || 0, data.status || 'active']
    );
    return this.findItemById(result.insertId);
  },

  async updateItem(id, data) {
    const fields = [];
    const params = [];
    const allowed = ['menu_id', 'label', 'url', 'sort_order', 'status'];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findItemById(id);
    params.push(id);
    await pool.query(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findItemById(id);
  },

  async findItemById(id) {
    const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async removeItem(id) {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
  },

  // Swap sort_order with the neighbor above (dir = 'up') or below (dir = 'down').
  async moveItem(id, dir) {
    const item = await this.findItemById(id);
    if (!item) return { item: null, items: [] };

    const [siblings] = await pool.query(
      `SELECT * FROM menu_items
       WHERE menu_id = ?
       ORDER BY sort_order ASC, id ASC`,
      [item.menu_id]
    );

    let neighbor = null;
    if (dir === 'up') {
      neighbor = siblings.filter((r) => r.id !== item.id && r.sort_order <= item.sort_order).pop() || null;
    } else {
      neighbor = siblings.filter((r) => r.id !== item.id && r.sort_order >= item.sort_order).shift() || null;
    }

    if (neighbor) {
      await pool.query('UPDATE menu_items SET sort_order = ? WHERE id = ?', [item.sort_order, neighbor.id]);
      await pool.query('UPDATE menu_items SET sort_order = ? WHERE id = ?', [neighbor.sort_order, item.id]);
    }

    return { item: await this.findItemById(id), items: await this.findItemsByMenu(item.menu_id) };
  },
};

export default Menu;