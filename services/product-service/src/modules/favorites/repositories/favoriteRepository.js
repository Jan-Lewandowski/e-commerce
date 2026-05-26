import db from '../../../db/knex.js';

const PRODUCT_COLUMNS = [
  'products.id',
  'products.category',
  'products.name',
  'products.brand',
  'products.price',
  'products.stock',
  'products.rating',
  'products.thumbnail',
  'products.tags',
  'products.specs',
  'products.description',
];

function mapRow(row) {
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

export async function listFavorites(userEmail) {
  const rows = await db('favorites')
    .innerJoin('products', 'products.id', 'favorites.product_id')
    .where('favorites.user_email', userEmail)
    .select(PRODUCT_COLUMNS)
    .orderBy('favorites.created_at', 'asc');
  return rows.map(mapRow);
}

export async function addFavorite(userEmail, productId) {
  await db('favorites')
    .insert({ user_email: userEmail, product_id: productId })
    .onConflict(['user_email', 'product_id'])
    .ignore();
}

export async function removeFavorite(userEmail, productId) {
  return db('favorites').where({ user_email: userEmail, product_id: productId }).del();
}

export async function clearFavorites(userEmail) {
  return db('favorites').where({ user_email: userEmail }).del();
}
