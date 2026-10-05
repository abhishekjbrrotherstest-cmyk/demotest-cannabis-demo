import { Router } from 'express';
import { getPosts, getPost } from '../controllers/blogController.js';

const router = Router();

router.get('/', getPosts);
router.get('/:slug', getPost);

export default router;