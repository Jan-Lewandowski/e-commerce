// === T3 — Sequelize v6 ===
// Tworzy tabele uzywane przez modele Supplier i ProductSupplier przed seedem.
// Sequelize nadal obsluguje runtime routes/model validation; Knex zapewnia schemat w migracjach.


export async function up(knex) {
  const hasSuppliers = await knex.schema.hasTable('suppliers');

  if (!hasSuppliers) {
    await knex.schema.createTable('suppliers', (t) => {
      t.increments('id').primary();
      t.text('name').notNullable();
      t.text('email').notNullable().unique();
      t.decimal('rating', 2, 1).notNullable().defaultTo(5.0);
      t.text('contact_name').nullable();
      t.text('phone').nullable();
      t.text('address').nullable();
      t.timestamps(true, true);
    });
  } else {
    const hasContactName = await knex.schema.hasColumn('suppliers', 'contact_name');
    const hasPhone = await knex.schema.hasColumn('suppliers', 'phone');
    const hasAddress = await knex.schema.hasColumn('suppliers', 'address');

    await knex.schema.alterTable('suppliers', (t) => {
      if (!hasContactName) t.text('contact_name').nullable();
      if (!hasPhone) t.text('phone').nullable();
      if (!hasAddress) t.text('address').nullable();
    });
  }

  const hasProductSuppliers = await knex.schema.hasTable('product_suppliers');

  if (!hasProductSuppliers) {
    await knex.schema.createTable('product_suppliers', (t) => {
      t.increments('id').primary();
      t.text('product_id').notNullable();
      t.integer('supplier_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('suppliers')
        .onDelete('CASCADE');
      t.integer('lead_days').notNullable();
      t.timestamps(true, true);
      t.unique(['supplier_id', 'product_id'], 'product_suppliers_supplier_id_product_id');
      t.index(['product_id'], 'idx_product_suppliers_product_id');
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('product_suppliers');
  await knex.schema.dropTableIfExists('suppliers');
}
