export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('role', 32).notNullable().defaultTo('user');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('sessions', (table) => {
    table.uuid('token').primary();
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.index('user_id');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('sessions');
  await knex.schema.dropTableIfExists('users');
}
