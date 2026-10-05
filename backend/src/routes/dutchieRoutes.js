import { Router } from 'express';
import {
  getConfig,
  getMenu,
  getMenuByCategory,
  getProduct,
} from '../controllers/dutchieController.js';

const router = Router();

router.get('/config', getConfig);
router.get('/menu/:storeId', getMenu);
router.get('/menu/:storeId/:category', getMenuByCategory);
router.get('/product/:productId', getProduct);

export default router;