import pool from '../config/db.js';

// GET /api/search?q=words — global search across posts, faqs, careers, stores, pages
export async function searchAll(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) {
      return res.json({ query: q, results: {} });
    }

    const like = `%${q}%`;
    const run = (sql, params) => pool.query(sql, params).then(([rows]) => rows);

    const [posts, faqs, careers, stores, pages] = await Promise.all([
      run(
        `SELECT id, title, slug, category, publish_date, featured_image AS image_url, '' AS snippet
           FROM blog_posts
          WHERE status='published' AND (title LIKE ? OR content LIKE ? OR category LIKE ? OR tags LIKE ?)
          ORDER BY publish_date DESC LIMIT 10`,
        [like, like, like, like]
      ),
      run(
        `SELECT id, question, answer, category
           FROM faqs
          WHERE status='active' AND (question LIKE ? OR answer LIKE ? OR category LIKE ?)
          ORDER BY display_order LIMIT 10`,
        [like, like, like]
      ),
      run(
        `SELECT id, title, location, employment_type, description
           FROM careers
          WHERE status='open' AND (title LIKE ? OR location LIKE ? OR description LIKE ? OR requirements LIKE ?)
          ORDER BY created_at DESC LIMIT 10`,
        [like, like, like, like]
      ),
      run(
        `SELECT id, slug, name, city, address
           FROM stores
          WHERE status='active' AND (name LIKE ? OR city LIKE ? OR address LIKE ? OR description LIKE ?)
          ORDER BY city LIMIT 10`,
        [like, like, like, like]
      ),
      run(
        `SELECT id, title, slug, meta_description AS description, hero_image_url AS image_url
           FROM pages
          WHERE status='published' AND (title LIKE ? OR slug LIKE ? OR content LIKE ?)
          ORDER BY title LIMIT 10`,
        [like, like, like]
      ),
    ]);

    res.json({
      query: q,
      results: {
        posts,
        faqs,
        careers,
        stores,
        pages,
      },
      totals: {
        posts: posts.length,
        faqs: faqs.length,
        careers: careers.length,
        stores: stores.length,
        pages: pages.length,
      },
    });
  } catch (err) {
    next(err);
  }
}