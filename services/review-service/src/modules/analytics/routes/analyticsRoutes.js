import { Router } from 'express';
import * as ctrl from '../controllers/analyticsController.js';

const router = Router();

router.get('/products/:productId/review-stats', ctrl.productReviewStats);

export default router;
