//migracja addytywna, tworzy tabele cart_items i favorites

export async function up(knex) {
  await knex.schema.createTable('cart_items', (t) => {
    t.text('user_email').notNullable();
    t.text('product_id')
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    t.integer('quantity').notNullable();
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.primary(['user_email', 'product_id']);
    t.index(['user_email'], 'idx_cart_items_user');
    t.check('?? > 0', ['quantity'], 'chk_cart_items_quantity_positive');
  });

  await knex.schema.createTable('favorites', (t) => {
    t.text('user_email').notNullable();
    t.text('product_id')
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.primary(['user_email', 'product_id']);
    t.index(['user_email'], 'idx_favorites_user');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('favorites');
  await knex.schema.dropTableIfExists('cart_items');
}
