import { getRequestToken } from '../middleware/authMiddleware.js';
import * as authService from '../services/authService.js';

export async function validate(req, res, next) {
  try {
    const user = await authService.getUserFromToken(getRequestToken(req));

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(authService.publicUser(user));
  } catch (error) {
    next(error);
  }
}
