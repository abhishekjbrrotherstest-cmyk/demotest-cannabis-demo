import { Banners, Sections } from '../models/homeModel.js';
import logger from '../utils/logger.js';

function isDuplicate(err) {
  return err?.code === 'ER_DUP_ENTRY';
}

// GET /api/home/banners (public)
export async function getBanners(_req, res, next) {
  try {
    const banners = await Banners.findActive();
    res.json({ banners });
  } catch (err) {
    next(err);
  }
}

// GET /api/home/sections (public)
export async function getSections(_req, res, next) {
  try {
    const sections = await Sections.findActive();
    res.json({ sections });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/home/banners (all statuses)
export async function adminListBanners(_req, res, next) {
  try {
    const banners = await Banners.findAll();
    res.json({ banners });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/home/sections (all statuses)
export async function adminListSections(_req, res, next) {
  try {
    const sections = await Sections.findAll();
    res.json({ sections });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/home/banners/:id
export async function adminGetBanner(req, res, next) {
  try {
    const banner = await Banners.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json({ banner });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/home/sections/:id
export async function adminGetSection(req, res, next) {
  try {
    const section = await Sections.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.json({ section });
  } catch (err) {
    next(err);
  }
}

// ---- Admin: banners ----
export async function createBanner(req, res, next) {
  try {
    if (!req.body.title || !req.body.image_url) {
      return res.status(400).json({ message: 'title and image_url are required' });
    }
    const banner = await Banners.create(req.body);
    logger.info(`Hero banner created: ${banner.title}`);
    res.status(201).json({ banner });
  } catch (err) {
    next(err);
  }
}

export async function updateBanner(req, res, next) {
  try {
    const existing = await Banners.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Banner not found' });
    const banner = await Banners.update(existing.id, req.body);
    logger.info(`Hero banner updated: ${banner.title}`);
    res.json({ banner });
  } catch (err) {
    next(err);
  }
}

export async function deleteBanner(req, res, next) {
  try {
    const banner = await Banners.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    await Banners.remove(banner.id);
    logger.info(`Hero banner deleted: ${banner.title}`);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    next(err);
  }
}

// ---- Admin: sections ----
export async function createSection(req, res, next) {
  try {
    if (!req.body.section_key) {
      return res.status(400).json({ message: 'section_key is required' });
    }
    const section = await Sections.create(req.body);
    logger.info(`Home section created: ${section.section_key}`);
    res.status(201).json({ section });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ message: 'A section with that key already exists' });
    }
    next(err);
  }
}

export async function updateSection(req, res, next) {
  try {
    const existing = await Sections.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Section not found' });
    const section = await Sections.update(existing.id, req.body);
    logger.info(`Home section updated: ${section.section_key}`);
    res.json({ section });
  } catch (err) {
    if (isDuplicate(err)) {
      return res.status(409).json({ message: 'A section with that key already exists' });
    }
    next(err);
  }
}

export async function deleteSection(req, res, next) {
  try {
    const section = await Sections.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await Sections.remove(section.id);
    logger.info(`Home section deleted: ${section.section_key}`);
    res.json({ message: 'Section deleted' });
  } catch (err) {
    next(err);
  }
}