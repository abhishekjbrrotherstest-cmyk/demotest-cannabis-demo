import Career from '../models/careerModel.js';
import logger from '../utils/logger.js';

// GET /api/careers
export async function getCareers(req, res, next) {
  try {
    let careers;
    if (req.user) {
      careers = await Career.findAll({});
      careers = await Promise.all(
        careers.map(async (c) => ({
          ...c,
          applications: await Career.countApplications(c.id),
        }))
      );
    } else {
      careers = await Career.findAll({ status: 'open' });
    }
    res.json({ careers });
  } catch (err) {
    next(err);
  }
}

// GET /api/careers/:id
export async function getCareer(req, res, next) {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job posting not found' });
    if (career.status !== 'open' && !req.user) {
      return res.status(404).json({ message: 'Job posting not found' });
    }
    res.json({ career });
  } catch (err) {
    next(err);
  }
}

// POST /api/careers/:id/apply  (mock — stores application, logs "email sent")
export async function applyToCareer(req, res, next) {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job posting not found' });
    if (career.status !== 'open') {
      return res.status(400).json({ message: 'This position is no longer open' });
    }

    const { first_name, last_name, email } = req.body || {};
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'first_name, last_name and email are required' });
    }

    const id = await Career.addApplication({
      career_id: career.id,
      first_name,
      last_name,
      email,
      phone: req.body.phone,
      resume_url: req.body.resume_url,
      cover_letter: req.body.cover_letter,
    });

    logger.info(`[mock] Application #${id} for "${career.title}" — email sent (mock)`);
    res.status(201).json({ message: 'Application submitted (mock)', id });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/careers
export async function adminListCareers(req, res, next) {
  try {
    const careers = await Career.findAll({});
    const withCounts = await Promise.all(
      careers.map(async (c) => ({
        ...c,
        applications: await Career.countApplications(c.id),
      }))
    );
    res.json({ careers: withCounts });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/careers/:id
export async function adminGetCareer(req, res, next) {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job posting not found' });
    res.json({ career });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/careers
export async function createCareer(req, res, next) {
  try {
    if (!req.body.title || !req.body.location) {
      return res.status(400).json({ message: 'title and location are required' });
    }
    const career = await Career.create(req.body);
    logger.info(`Career created: ${career.title}`);
    res.status(201).json({ career });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/careers/:id
export async function updateCareer(req, res, next) {
  try {
    const existing = await Career.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Job posting not found' });
    const career = await Career.update(existing.id, req.body);
    logger.info(`Career updated: ${career.title}`);
    res.json({ career });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/careers/:id
export async function deleteCareer(req, res, next) {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job posting not found' });
    await Career.remove(career.id);
    logger.info(`Career deleted: ${career.title}`);
    res.json({ message: 'Career deleted' });
  } catch (err) {
    next(err);
  }
}