import { Router } from 'express';

import * as productController from '../controllers/productController.js';

const router = Router();

router.get('/categories', productController.getCategories);
router.get('/products', productController.getProducts);
router.get('/products/:id/related', productController.getRelatedProducts);
router.get('/products/:id', productController.getProductById);

export default router;
