import AboutSection from '../models/aboutModel.js';
import logger from '../utils/logger.js';

// GET /api/about/sections (public)
export async function getAboutSections(_req, res, next) {
  try {
    const sections = await AboutSection.findActive();
    res.json({ sections });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/about (all statuses)
export async function adminListAboutSections(_req, res, next) {
  try {
    const sections = await AboutSection.findAll();
    res.json({ sections });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/about/:id
export async function adminGetAboutSection(req, res, next) {
  try {
    const section = await AboutSection.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'About section not found' });
    res.json({ section });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/about
export async function createAboutSection(req, res, next) {
  try {
    const section = await AboutSection.create(req.body);
    logger.info(`About section created: ${section.section_type}`);
    res.status(201).json({ section });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/about/:id
export async function updateAboutSection(req, res, next) {
  try {
    const existing = await AboutSection.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'About section not found' });
    const section = await AboutSection.update(existing.id, req.body);
    logger.info(`About section updated: ${section.section_type}`);
    res.json({ section });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/about/:id
export async function deleteAboutSection(req, res, next) {
  try {
    const section = await AboutSection.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'About section not found' });
    await AboutSection.remove(section.id);
    logger.info(`About section deleted: ${section.section_type}`);
    res.json({ message: 'About section deleted' });
  } catch (err) {
    next(err);
  }
}