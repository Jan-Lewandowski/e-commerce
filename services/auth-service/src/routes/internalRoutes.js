import { Router } from 'express';

import * as internalController from '../controllers/internalController.js';

const router = Router();

//internal route: weryfikacja tokena sesji bez udostepniania bazy auth
router.get('/validate', internalController.validate);

export default router;
