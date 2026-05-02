import * as productRepository from '../repositories/productRepository.js';
import { HttpError } from '../utils/httpError.js';

function toNumber(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getCategories() {
  return productRepository.getCategories();
}

export function getProducts(filters = {}) {
  const {
    category,
    priceFrom,
    priceTo,
    producer,
    ratingFrom,
    ratingTo,
    q,
  } = filters;

  const minPrice = toNumber(priceFrom);
  const maxPrice = toNumber(priceTo);
  const minRating = toNumber(ratingFrom);
  const maxRating = toNumber(ratingTo);
  const normalizedQuery = q?.trim().toLowerCase();

  return productRepository.getProducts().filter((product) => {
    if (category && product.category !== category) return false;
    if (producer && product.brand !== producer) return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    if (minRating !== null && product.rating < minRating) return false;
    if (maxRating !== null && product.rating > maxRating) return false;

    if (normalizedQuery) {
      const searchable = [
        product.name,
        product.description,
        product.brand,
        product.category,
        ...product.tags,
      ].join(' ').toLowerCase();

      if (!searchable.includes(normalizedQuery)) return false;
    }

    return true;
  });
}

export function getProductById(productId) {
  const product = productRepository.getProductById(productId);

  if (!product) {
    throw new HttpError(404, 'Product not found');
  }

  return product;
}

export function getRelatedProducts(productId, limit = 5) {
  const product = getProductById(productId);
  const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;

  return productRepository
    .getProducts()
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => ({
      product: candidate,
      score: candidate.tags.filter((tag) => product.tags.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(safeLimit, 0))
    .map(({ product: relatedProduct }) => relatedProduct);
}
