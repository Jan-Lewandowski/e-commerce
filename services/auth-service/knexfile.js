import 'dotenv/config';

const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: './db/knex/migrations',
    loadExtensions: ['.js'],
  },
  seeds: {
    directory: './db/knex/seeds',
    loadExtensions: ['.js'],
  },
};

export default config;
