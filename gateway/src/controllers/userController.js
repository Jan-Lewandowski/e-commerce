import * as authService from '../services/authService.js';

export function updateMe(req, res) {
  res.json(authService.updateCurrentUser(req.auth.user.id, req.body));
}
