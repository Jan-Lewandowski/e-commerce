import * as cartRepository from '../repositories/cartRepository.js';
import * as productRepository from '../../catalog/repositories/productRepository.js';
import { HttpError } from '../../../utils/httpError.js';

const MAX_CART_ITEM_QUANTITY = 3;

export function listCart(user) {
  return cartRepository.listCart(user.email);
}

export async function setQuantity(user, productId, quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new HttpError(400, 'quantity musi byc dodatnia liczba calkowita.');
  }
  if (quantity > MAX_CART_ITEM_QUANTITY) {
    throw new HttpError(409, `Mozesz zamowic maksymalnie ${MAX_CART_ITEM_QUANTITY} sztuki tego produktu.`);
  }

  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new HttpError(404, `Nie znaleziono produktu ${productId}`);
  }
  if (quantity > product.stock) {
    throw new HttpError(409, 'Wybrana ilosc produktu przekracza dostepny stan magazynowy.');
  }

  await cartRepository.upsertCartItem(user.email, productId, quantity);
  return cartRepository.listCart(user.email);
}

export async function removeItem(user, productId) {
  await cartRepository.deleteCartItem(user.email, productId);
  return cartRepository.listCart(user.email);
}

export async function clearCart(user) {
  await cartRepository.clearCart(user.email);
  return [];
}
