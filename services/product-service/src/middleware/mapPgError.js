// mapowanie bledow pg na httperror
import { HttpError } from '../utils/httpError.js';

const PG_CODE_MAP = {
  23505: [409, 'Naruszenie unikalnosci'],
  23503: [409, 'Naruszenie klucza obcego'],
  23502: [400, 'Brak wymaganej wartosci'],
  23514: [400, 'Naruszenie ograniczenia CHECK'],
};

export function mapPgError(err, _req, _res, next) {
  if (err && err.code && PG_CODE_MAP[err.code]) {
    const [status, message] = PG_CODE_MAP[err.code];
    const detail = err.constraint || err.detail || err.code;
    return next(new HttpError(status, `${message} (${detail})`));
  }
  return next(err);
}
