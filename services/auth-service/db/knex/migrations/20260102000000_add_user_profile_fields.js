export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('name', 120).nullable();
    table.string('phone', 32).nullable();
    table.string('street', 160).nullable();
    table.string('city', 80).nullable();
    table.string('zip_code', 16).nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('zip_code');
    table.dropColumn('city');
    table.dropColumn('street');
    table.dropColumn('phone');
    table.dropColumn('name');
  });
}
