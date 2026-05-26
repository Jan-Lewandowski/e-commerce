import { Router } from 'express';
import * as ctrl from '../controllers/supplierController.js';

const router = Router();

router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id/products', ctrl.getProducts);
router.get('/:id', ctrl.getById);

export default router;
