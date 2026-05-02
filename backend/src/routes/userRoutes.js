import { Router } from 'express';

import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/users/me', authenticate, userController.updateMe);

export default router;
