import * as productService from '../services/productService.js';

export async function getCategories(_req, res, next) {
  try {
    res.json(await productService.getCategories());
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req, res, next) {
  try {
    res.json(await productService.getProducts(req.query));
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    res.json(await productService.getProductById(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function getRelatedProducts(req, res, next) {
  try {
    res.json(await productService.getRelatedProducts(req.params.id, req.query.limit));
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const payload = { ...req.body };
    if (req.file?.filename) {
      payload.thumbnail = `/uploads/products/${req.file.filename}`;
    }
    res.json(await productService.updateProduct(req.params.id, payload));
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const payload = { ...req.body };
    if (req.file?.filename) {
      payload.thumbnail = `/uploads/products/${req.file.filename}`;
    }
    res.status(201).json(await productService.createProduct(payload));
  } catch (err) {
    next(err);
  }
}
