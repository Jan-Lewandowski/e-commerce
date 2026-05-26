// === T2 — Knex.js ===
// Seed domenowy: kategorie i produkty z `data/catalog.json`.
// Idempotentny (czysci tabele przed insertem) - bezpieczny do uzytku w dev/CI.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, '..', '..', '..', 'data', 'catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));

export async function seed(knex) {
  const now = new Date();

  await knex('product_suppliers').del();
  await knex('suppliers').del();
  await knex('favorites').del();
  await knex('cart_items').del();
  await knex('order_items').del();
  await knex('orders').del();
  await knex('products').del();
  await knex('categories').del();

  await knex('categories').insert(catalog.categories.map((name) => ({ name })));

  await knex('products').insert(
    catalog.products.map((p) => ({
      id: p.id,
      category: p.category,
      name: p.name,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      rating: p.rating,
      thumbnail: p.thumbnail,
      tags: JSON.stringify(p.tags || []),
      specs: JSON.stringify(p.specs || {}),
      description: p.description || '',
    })),
  );

  await knex('suppliers').insert(
    catalog.suppliers.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      rating: supplier.rating,
      contact_name: supplier.contactName || null,
      phone: supplier.phone || null,
      address: supplier.address || null,
      created_at: now,
      updated_at: now,
    })),
  );

  await knex.raw(
    "select setval(pg_get_serial_sequence('suppliers', 'id'), coalesce((select max(id) from suppliers), 1), true)",
  );

  await knex('product_suppliers').insert(
    catalog.productSuppliers.map((link) => ({
      supplier_id: link.supplierId,
      product_id: link.productId,
      lead_days: link.leadDays,
      created_at: now,
      updated_at: now,
    })),
  );
}
