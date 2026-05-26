import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { requireAdmin } from '../../../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAdmin, orderController.getAdminOrders);

export default router;
