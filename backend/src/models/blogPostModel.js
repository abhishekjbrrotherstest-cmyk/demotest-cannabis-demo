import pool from '../config/db.js';

const BlogPost = {
  async findAll({ status } = {}) {
    const where = status ? 'WHERE status = ?' : '';
    const params = status ? [status] : [];
    const [rows] = await pool.query(
      `SELECT * FROM blog_posts ${where} ORDER BY publish_date DESC, id DESC`,
      params
    );
    return rows;
  },

  async findPublishedWithTag(tag) {
    const [rows] = await pool.query(
      `SELECT * FROM blog_posts
        WHERE status = 'published' AND (tags LIKE ? OR category = ?)
        ORDER BY publish_date DESC`,
      [`%${tag}%`, tag]
    );
    return rows;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO blog_posts
         (title, slug, featured_image, content, author, category, tags, publish_date,
          seo_title, meta_description, og_image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.slug, data.featured_image || null, data.content || null,
        data.author, data.category || null, data.tags || null, data.publish_date || null,
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
      'title', 'slug', 'featured_image', 'content', 'author', 'category', 'tags',
      'publish_date', 'seo_title', 'meta_description', 'og_image', 'status',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);
  },
};

export default BlogPost;