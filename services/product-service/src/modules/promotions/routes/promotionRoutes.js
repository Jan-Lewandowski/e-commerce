import { Router } from 'express';
import * as ctrl from '../controllers/promotionController.js';

const router = Router();

router.get('/active', ctrl.activeNow); //raw sql
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.delete('/:id', ctrl.remove);

export default router;
