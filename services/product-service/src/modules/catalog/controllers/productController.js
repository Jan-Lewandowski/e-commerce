import * as productService from '../services/productService.js';
import { redisCacheTtlSeconds } from '../../../config/env.js';
import { getCache, setCache } from '../../../db/redis.js';

export async function getCategories(_req, res, next) {
  try {
    res.json(await productService.getCategories());
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req, res, next) {
  try {
    const cacheKey = `products:${req.originalUrl}`;
    const cached = await getCache(cacheKey).catch((err) => {
      console.warn('[redis] cache read skipped:', err.message);
      return null;
    });

    if (cached) {
      res.set('X-Cache', 'HIT');
      res.type('application/json').send(cached);
      return;
    }

    const products = await productService.getProducts(req.query);
    res.set('X-Cache', 'MISS');

    await setCache(cacheKey, JSON.stringify(products), redisCacheTtlSeconds).catch((err) => {
      console.warn('[redis] cache write skipped:', err.message);
    });

    res.json(products);
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
