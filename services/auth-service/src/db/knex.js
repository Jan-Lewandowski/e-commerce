import knex from 'knex';
import { databaseUrl } from '../config/env.js';

const db = knex({
  client: 'pg',
  connection: databaseUrl,
});

export default db;
