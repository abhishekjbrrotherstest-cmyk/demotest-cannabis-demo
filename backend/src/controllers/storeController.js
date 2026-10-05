import Store from '../models/storeModel.js';
import Event from '../models/eventModel.js';
import logger from '../utils/logger.js';

// GET /api/stores
export async function getStores(req, res, next) {
  try {
    const stores = await Store.findAll({ status: 'active' });
    res.json({ stores });
  } catch (err) {
    next(err);
  }
}

// GET /api/stores/:idOrSlug
export async function getStore(req, res, next) {
  try {
    const store = await Store.findByIdOrSlug(req.params.idOrSlug);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    if (store.status !== 'active' && !req.user) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [hours, holidayHours] = await Promise.all([
      Store.getHours(store.id),
      Store.getHolidayHours(store.id),
    ]);

    res.json({ store, hours, holidayHours });
  } catch (err) {
    next(err);
  }
}

// GET /api/stores/slug/:slug — single store by slug (same shape as /:idOrSlug)
export async function getStoreBySlug(req, res, next) {
  try {
    const store = await Store.findBySlug(req.params.slug);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    if (store.status !== 'active' && !req.user) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [hours, holidayHours] = await Promise.all([
      Store.getHours(store.id),
      Store.getHolidayHours(store.id),
    ]);

    res.json({ store, hours, holidayHours });
  } catch (err) {
    next(err);
  }
}

// GET /api/stores/:id/hours
export async function getStoreHours(req, res, next) {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const [hours, holidayHours] = await Promise.all([
      Store.getHours(store.id),
      Store.getHolidayHours(store.id),
    ]);
    res.json({ hours, holidayHours });
  } catch (err) {
    next(err);
  }
}

// GET /api/stores/:id/events
export async function getStoreEvents(req, res, next) {
  try {
    const events = await Event.findByStore(req.params.id, { upcoming: true });
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores  (all statuses)
export async function adminListStores(_req, res, next) {
  try {
    const stores = await Store.findAll();
    res.json({ stores });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores/:id
export async function adminGetStore(req, res, next) {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const [hours, holidayHours] = await Promise.all([
      Store.getHours(store.id),
      Store.getHolidayHours(store.id),
    ]);
    res.json({ store, hours, holidayHours });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/stores
export async function createStore(req, res, next) {
  try {
    if (!req.body.slug || !req.body.name || !req.body.address) {
      return res.status(400).json({ message: 'slug, name and address are required' });
    }
    const store = await Store.create(req.body);
    logger.info(`Store created: ${store.name}`);
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/stores/:id
export async function updateStore(req, res, next) {
  try {
    const existing = await Store.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Store not found' });
    const store = await Store.update(existing.id, req.body);
    if (Array.isArray(req.body.hours)) {
      await Store.upsertHours(existing.id, req.body.hours);
    }
    logger.info(`Store updated: ${store.name}`);
    res.json({ store });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/stores/:id
export async function deleteStore(req, res, next) {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    await Store.remove(store.id);
    logger.info(`Store deleted: ${store.name}`);
    res.json({ message: 'Store deleted' });
  } catch (err) {
    next(err);
  }
}