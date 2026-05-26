//migracja addytywna, tworzy schemat katalogu i zamowien

export async function up(knex) {
  await knex.schema.createTable('categories', (t) => {
    t.text('name').primary();
  });

  await knex.schema.createTable('products', (t) => {
    t.text('id').primary();
    t.text('category').notNullable().references('name').inTable('categories');
    t.text('name').notNullable();
    t.text('brand').notNullable();
    t.decimal('price', 10, 2).notNullable();
    t.integer('stock').notNullable();
    t.decimal('rating', 2, 1).notNullable();
    t.text('thumbnail').notNullable();
    t.jsonb('tags').notNullable().defaultTo('[]');
    t.jsonb('specs').notNullable().defaultTo('{}');
    t.text('description').notNullable();
    t.index(['category']);
  });

  await knex.schema.createTable('orders', (t) => {
    t.uuid('order_id').primary();
    t.text('email').notNullable().index();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.text('status').notNullable().defaultTo('completed');
    t.decimal('total_amount', 10, 2).notNullable();
    t.text('payment_method').notNullable().defaultTo('');
    t.text('delivery_method').notNullable().defaultTo('');
    t.text('shipper').nullable();
    t.jsonb('destination').notNullable().defaultTo('{}');
  });

  await knex.schema.createTable('order_items', (t) => {
    t.uuid('order_id').notNullable().references('order_id').inTable('orders').onDelete('CASCADE');
    t.text('product_id').notNullable().references('id').inTable('products');
    t.text('name').notNullable();
    t.integer('quantity').notNullable();
    t.decimal('unit_price', 10, 2).notNullable();
    t.decimal('line_total', 10, 2).notNullable();
    t.primary(['order_id', 'product_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('categories');
}
