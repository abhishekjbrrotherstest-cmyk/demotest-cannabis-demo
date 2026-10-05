import { Router } from 'express';
import { getAboutSections } from '../controllers/aboutController.js';

const router = Router();

router.get('/sections', getAboutSections);

export default router;