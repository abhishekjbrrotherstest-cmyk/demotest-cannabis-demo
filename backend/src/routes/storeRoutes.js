import { Router } from 'express';
import {
  getStores,
  getStore,
  getStoreBySlug,
  getStoreHours,
  getStoreEvents,
} from '../controllers/storeController.js';

const router = Router();

router.get('/', getStores);
router.get('/slug/:slug', getStoreBySlug);
router.get('/:id/hours', getStoreHours);
router.get('/:id/events', getStoreEvents);
router.get('/:idOrSlug', getStore);

export default router;