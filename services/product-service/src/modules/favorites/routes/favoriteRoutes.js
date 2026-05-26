import { Router } from 'express';
import * as ctrl from '../controllers/favoriteController.js';
import { requireAuth } from '../../../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);
router.get('/', ctrl.list);
router.delete('/', ctrl.clear);
router.post('/:productId', ctrl.add);
router.delete('/:productId', ctrl.remove);

export default router;
