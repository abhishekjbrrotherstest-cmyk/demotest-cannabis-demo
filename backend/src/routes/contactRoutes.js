import { Router } from 'express';
import { createMessage } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', contactLimiter, createMessage);

export default router;