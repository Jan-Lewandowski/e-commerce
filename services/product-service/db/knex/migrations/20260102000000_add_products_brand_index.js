//migracja addytywna, dodaje index do kolumny brand w tabeli products
export async function up(knex) {
  await knex.schema.alterTable('products', (t) => {
    t.index(['brand'], 'idx_products_brand');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('products', (t) => {
    t.dropIndex(['brand'], 'idx_products_brand');
  });
}
