import { Router } from 'express';
import * as ctrl from '../controllers/cartController.js';
import { requireAuth } from '../../../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);
router.get('/', ctrl.list);
router.delete('/', ctrl.clear);
router.put('/:productId', ctrl.setQuantity);
router.delete('/:productId', ctrl.removeItem);

export default router;
