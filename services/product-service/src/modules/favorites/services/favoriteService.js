import * as favoriteRepository from '../repositories/favoriteRepository.js';
import * as productRepository from '../../catalog/repositories/productRepository.js';
import { HttpError } from '../../../utils/httpError.js';

export function listFavorites(user) {
  return favoriteRepository.listFavorites(user.email);
}

export async function addFavorite(user, productId) {
  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new HttpError(404, `Nie znaleziono produktu ${productId}`);
  }
  await favoriteRepository.addFavorite(user.email, productId);
  return favoriteRepository.listFavorites(user.email);
}

export async function removeFavorite(user, productId) {
  await favoriteRepository.removeFavorite(user.email, productId);
  return favoriteRepository.listFavorites(user.email);
}

export async function clearFavorites(user) {
  await favoriteRepository.clearFavorites(user.email);
  return [];
}
