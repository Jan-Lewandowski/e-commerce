import * as productService from '../services/productService.js';

export function getCategories(_req, res) {
  res.json(productService.getCategories());
}

export function getProducts(req, res) {
  res.json(productService.getProducts(req.query));
}

export function getProductById(req, res) {
  res.json(productService.getProductById(req.params.id));
}

export function getRelatedProducts(req, res) {
  res.json(productService.getRelatedProducts(req.params.id, req.query.limit));
}
