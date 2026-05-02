import { categories, products } from '../../data.js';

export function getCategories() {
  return categories;
}

export function getProducts() {
  return products;
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId) || null;
}

export function updateProductStock(productId, nextStock) {
  const product = getProductById(productId);

  if (!product) {
    return null;
  }

  product.stock = nextStock;
  return product;
}
