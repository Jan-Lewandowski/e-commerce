import express, { Router } from 'express';

import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
const json = express.json();

router.post('/auth/register', json, authController.register);
router.post('/auth/login', json, authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authenticate, authController.getMe);

export default router;
