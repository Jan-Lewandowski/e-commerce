import db from '../../../db/knex.js';

const PRODUCT_COLUMNS = [
  'products.id as p_id',
  'products.category as p_category',
  'products.name as p_name',
  'products.brand as p_brand',
  'products.price as p_price',
  'products.stock as p_stock',
  'products.rating as p_rating',
  'products.thumbnail as p_thumbnail',
  'products.tags as p_tags',
  'products.specs as p_specs',
  'products.description as p_description',
];

function mapJoinedRow(row) {
  return {
    product: {
      id: row.p_id,
      category: row.p_category,
      name: row.p_name,
      brand: row.p_brand,
      price: Number(row.p_price),
      stock: Number(row.p_stock),
      rating: Number(row.p_rating),
      thumbnail: row.p_thumbnail,
      tags: row.p_tags,
      specs: row.p_specs,
      description: row.p_description,
    },
    quantity: Number(row.quantity),
  };
}

//knex where z joinem do products
export async function listCart(userEmail) {
  const rows = await db('cart_items')
    .innerJoin('products', 'products.id', 'cart_items.product_id')
    .where('cart_items.user_email', userEmail)
    .select('cart_items.quantity', ...PRODUCT_COLUMNS)
    .orderBy('cart_items.product_id', 'asc');
  return rows.map(mapJoinedRow);
}

export async function upsertCartItem(userEmail, productId, quantity) {
  await db('cart_items')
    .insert({
      user_email: userEmail,
      product_id: productId,
      quantity,
      updated_at: db.fn.now(),
    })
    .onConflict(['user_email', 'product_id'])
    .merge({ quantity, updated_at: db.fn.now() });
}

export async function deleteCartItem(userEmail, productId) {
  return db('cart_items').where({ user_email: userEmail, product_id: productId }).del();
}

export async function clearCart(userEmail) {
  return db('cart_items').where({ user_email: userEmail }).del();
}

export async function getCartItemQuantity(userEmail, productId) {
  const row = await db('cart_items')
    .where({ user_email: userEmail, product_id: productId })
    .first();
  return row ? Number(row.quantity) : 0;
}
