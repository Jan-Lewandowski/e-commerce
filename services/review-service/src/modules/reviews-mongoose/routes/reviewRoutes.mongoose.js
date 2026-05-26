import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.mongoose.js';

const router = Router();

router.post('/mongoose', ctrl.create);
router.get('/:id/detail', ctrl.detail);

export default router;
