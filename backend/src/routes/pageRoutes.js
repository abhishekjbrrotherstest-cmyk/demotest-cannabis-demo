import { Router } from 'express';
import { getPages, getPageBySlug } from '../controllers/pageController.js';

const router = Router();

router.get('/', getPages);
router.get('/:slug', getPageBySlug);

export default router;