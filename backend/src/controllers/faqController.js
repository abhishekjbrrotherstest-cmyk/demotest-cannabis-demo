import FAQ from '../models/faqModel.js';
import logger from '../utils/logger.js';

// GET /api/faqs
export async function getFaqs(req, res, next) {
  try {
    const { category } = req.query;
    let faqs;

    if (req.user) {
      faqs = await FAQ.findAll({});
    } else {
      faqs = await FAQ.findAll({ status: 'active' });
    }

    if (category && category !== 'all') {
      faqs = faqs.filter((f) => f.category === category);
    }

    const categories = await FAQ.findCategories();
    res.json({ faqs, categories });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/faqs
export async function adminListFaqs(req, res, next) {
  try {
    const faqs = await FAQ.findAll({});
    const categories = await FAQ.findCategories();
    res.json({ faqs, categories });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/faqs/:id
export async function adminGetFaq(req, res, next) {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ faq });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/faqs
export async function createFaq(req, res, next) {
  try {
    if (!req.body.question || !req.body.answer) {
      return res.status(400).json({ message: 'question and answer are required' });
    }
    const faq = await FAQ.create(req.body);
    logger.info(`FAQ created: ${faq.question}`);
    res.status(201).json({ faq });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/faqs/:id
export async function updateFaq(req, res, next) {
  try {
    const existing = await FAQ.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'FAQ not found' });
    const faq = await FAQ.update(existing.id, req.body);
    logger.info(`FAQ updated: ${faq.question}`);
    res.json({ faq });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/faqs/:id
export async function deleteFaq(req, res, next) {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    await FAQ.remove(faq.id);
    logger.info(`FAQ deleted: ${faq.question}`);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    next(err);
  }
}