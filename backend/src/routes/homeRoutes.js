import { Router } from 'express';
import { getBanners, getSections } from '../controllers/homeController.js';

const router = Router();

router.get('/banners', getBanners);
router.get('/sections', getSections);

export default router;