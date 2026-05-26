// dynamiczny where bez sklejania sql z stringow
import db from '../../../db/knex.js';

const PRODUCT_COLUMNS = [
  'id',
  'category',
  'name',
  'brand',
  'price',
  'stock',
  'rating',
  'thumbnail',
  'tags',
  'specs',
  'description',
];

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    stock: Number(row.stock),
    rating: Number(row.rating),
    thumbnail: row.thumbnail,
    tags: row.tags,
    specs: row.specs,
    description: row.description,
  };
}

function serializeProductJsonFields(payload) {
  const normalized = { ...payload };
  if (normalized.tags !== undefined && typeof normalized.tags !== 'string') {
    normalized.tags = JSON.stringify(normalized.tags);
  }
  if (normalized.specs !== undefined && typeof normalized.specs !== 'string') {
    normalized.specs = JSON.stringify(normalized.specs);
  }
  return normalized;
}

export async function getCategories() {
  const rows = await db('categories').select('name').orderBy('name');
  return rows.map((r) => r.name);
}

export async function findProducts(filters = {}) {
  let q = db('products').select(PRODUCT_COLUMNS);

  if (filters.category) q = q.where('category', filters.category);
  if (filters.producer) q = q.where('brand', filters.producer);
  if (filters.priceFrom !== null && filters.priceFrom !== undefined) {
    q = q.where('price', '>=', filters.priceFrom);
  }
  if (filters.priceTo !== null && filters.priceTo !== undefined) {
    q = q.where('price', '<=', filters.priceTo);
  }
  if (filters.ratingFrom !== null && filters.ratingFrom !== undefined) {
    q = q.where('rating', '>=', filters.ratingFrom);
  }
  if (filters.ratingTo !== null && filters.ratingTo !== undefined) {
    q = q.where('rating', '<=', filters.ratingTo);
  }
  if (filters.q) {
    const pattern = `%${filters.q}%`;
    q = q.where((b) =>
      b
        .whereILike('name', pattern)
        .orWhereILike('description', pattern)
        .orWhereILike('brand', pattern),
    );
  }

  const rows = await q.orderBy('name');
  return rows.map(mapRow);
}

export async function getProductById(productId) {
  const row = await db('products').select(PRODUCT_COLUMNS).where({ id: productId }).first();
  return mapRow(row);
}

export async function updateProductById(productId, changes) {
  const payload = serializeProductJsonFields(changes);

  const [row] = await db('products')
    .where({ id: productId })
    .update(payload)
    .returning(PRODUCT_COLUMNS);
  return mapRow(row);
}

export async function createProduct(product) {
  const payload = serializeProductJsonFields(product);
  const [row] = await db('products').insert(payload).returning(PRODUCT_COLUMNS);
  return mapRow(row);
}

export async function getProductsByIds(productIds = []) {
  if (!productIds.length) return [];

  const rows = await db('products')
    .select(PRODUCT_COLUMNS)
    .whereIn('id', productIds)
    .orderBy('name');

  return rows.map(mapRow);
}

export async function getAllProducts() {
  const rows = await db('products').select(PRODUCT_COLUMNS);
  return rows.map(mapRow);
}
