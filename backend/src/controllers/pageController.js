import Page from '../models/pageModel.js';
import logger from '../utils/logger.js';

function isDuplicate(err) {
  return err?.code === 'ER_DUP_ENTRY';
}

// GET /api/pages (public — published list)
export async function getPages(_req, res, next) {
  try {
    const pages = await Page.findAll({ status: 'published' });
    res.json({ pages });
  } catch (err) {
    next(err);
  }
}

// GET /api/pages/:slug (public)
export async function getPageBySlug(req, res, next) {
  try {
    const page = await Page.findBySlug(req.params.slug);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ page });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/pages (admin — all statuses)
export async function adminListPages(_req, res, next) {
  try {
    const pages = await Page.findAll();
    res.json({ pages });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/pages/:id
export async function adminGetPage(req, res, next) {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ page });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/pages
export async function adminCreatePage(req, res, next) {
  try {
    if (!req.body.title || !req.body.slug) {
      return res.status(400).json({ message: 'title and slug are required' });
    }
    const page = await Page.create(req.body);
    logger.info(`Page created: ${page.title} (${page.slug})`);
    res.status(201).json({ page });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ message: 'A page with that slug already exists' });
    }
    next(err);
  }
}

// PUT /api/admin/pages/:id
export async function adminUpdatePage(req, res, next) {
  try {
    const existing = await Page.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Page not found' });
    const page = await Page.update(existing.id, req.body);
    logger.info(`Page updated: ${page.title}`);
    res.json({ page });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ message: 'A page with that slug already exists' });
    }
    next(err);
  }
}

// DELETE /api/admin/pages/:id
export async function adminDeletePage(req, res, next) {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    await Page.remove(page.id);
    logger.info(`Page deleted: ${page.title}`);
    res.json({ message: 'Page deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/pages/:id/publish
export async function adminPublishPage(req, res, next) {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    const updated = await Page.publish(page.id, req.body.status === 'draft' ? 'draft' : 'published');
    logger.info(`Page status -> ${updated.status}: ${updated.title}`);
    res.json({ page: updated });
  } catch (err) {
    next(err);
  }
}