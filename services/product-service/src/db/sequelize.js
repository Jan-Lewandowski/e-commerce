// pool sequelize
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 5, min: 0, idle: 10000 },
});

export default sequelize;
