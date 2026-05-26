import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { requireAdmin } from '../../../middleware/requireAuth.js';
import { productImageUpload } from '../../../middleware/uploadMiddleware.js';

const router = Router();

router.get('/categories', productController.getCategories);
router.get('/products', productController.getProducts);
router.post(
  '/products',
  requireAdmin,
  productImageUpload.single('thumbnail'),
  productController.createProduct,
);
router.get('/products/:id/related', productController.getRelatedProducts);
router.get('/products/:id', productController.getProductById);
router.put(
  '/products/:id',
  requireAdmin,
  productImageUpload.single('thumbnail'),
  productController.updateProduct,
);

export default router;
