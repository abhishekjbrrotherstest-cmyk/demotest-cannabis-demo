import pool from '../config/db.js';

const BASE_URL = process.env.SITE_URL || 'https://demotest.example.com';

// GET /sitemap.xml
export async function sitemap(_req, res, next) {
  try {
    const run = (sql, params) => pool.query(sql, params).then(([rows]) => rows);
    const [posts, stores, careers, pages] = await Promise.all([
      run("SELECT slug FROM blog_posts WHERE status='published'"),
      run("SELECT slug FROM stores WHERE status='active'"),
      run("SELECT id FROM careers WHERE status='open'"),
      run("SELECT slug FROM pages WHERE status='published'"),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const staticUrls = [
      '', '/shop', '/locations', '/faq', '/medical-card', '/rewards', '/about', '/community',
      '/blog', '/careers', '/contact', '/privacy', '/terms', '/accessibility',
    ];
    const url = (loc) =>
      `  <url><loc>${BASE_URL}${loc}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...staticUrls.map(url),
      ...posts.map((p) => url(`/blog/${p.slug}`)),
      ...stores.map((s) => url(`/locations/${s.slug}`)),
      ...careers.map((c) => url(`/careers/${c.id}`)),
      ...pages.map((pg) => url(`/p/${pg.slug}`)),
      '</urlset>',
      '',
    ].join('\n');

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

// GET /robots.txt
export function robots(_req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(
    [
      'User-agent: *',
      'Allow: /',
      `Sitemap: ${BASE_URL}/sitemap.xml`,
      '',
      'DemoTest Cannabis Co. — demo project. Must be 18+ with a valid PA medical card.',
      '',
    ].join('\n')
  );
}