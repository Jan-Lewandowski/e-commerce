// === T1 + T2 ===
// POST /orders -> T2 (knex.transaction), GET ... -> T1 (pool.query parametryzowane).
import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { requireAuth } from '../../../middleware/requireAuth.js';

const router = Router();

router.post('/', requireAuth, orderController.createOrder);
router.get('/me', requireAuth, orderController.getMyOrders);
router.get('/:orderId', requireAuth, orderController.getOrderById);

export default router;
