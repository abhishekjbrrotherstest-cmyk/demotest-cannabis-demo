import { Router } from 'express';
import {
  getCareers,
  getCareer,
  applyToCareer,
} from '../controllers/careerController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', getCareers);
router.get('/:id', getCareer);
router.post('/:id/apply', contactLimiter, applyToCareer);

export default router;