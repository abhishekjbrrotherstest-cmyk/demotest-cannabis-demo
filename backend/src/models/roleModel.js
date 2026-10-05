import pool from '../config/db.js';

const Role = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM roles ORDER BY id');
    return rows;
  },

  async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM roles WHERE name = ?', [name]);
    return rows[0] || null;
  },

  async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT r.* FROM roles r JOIN users u ON u.role_id = r.id WHERE u.id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  async permissionsForRole(roleId) {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.module
         FROM permissions p
         JOIN role_permissions rp ON rp.permission_id = p.id
        WHERE rp.role_id = ?`,
      [roleId]
    );
    return rows;
  },

  async getPermissionsForUser(userId) {
    const [rows] = await pool.query(
      `SELECT DISTINCT p.name
         FROM permissions p
         JOIN role_permissions rp ON rp.permission_id = p.id
         JOIN users u ON u.role_id = rp.role_id
        WHERE u.id = ?`,
      [userId]
    );
    return rows.map((r) => r.name);
  },
};

export default Role;