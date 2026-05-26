import * as authService from '../services/authService.js';


export async function updateMyProfile(req, res, next) {
  try {
    res.json(await authService.updateCurrentUserProfile(req.auth.user.id, req.body));
  } catch (error) {
    next(error);
  }
}
