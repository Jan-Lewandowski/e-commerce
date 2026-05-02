import { Router } from 'express';

import * as orderController from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/orders', authenticate, orderController.createOrder);
router.get('/orders/me', authenticate, orderController.getMyOrders);
router.get('/orders/:orderId', authenticate, orderController.getOrderById);
router.get('/admin/orders', requireAdmin, orderController.getAdminOrders);

export default router;
