//model productSupplier z walidacja i relacja do suppliera
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../db/sequelize.js';
import { Supplier } from './Supplier.js';

export class ProductSupplier extends Model { }

ProductSupplier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'product_id',
      validate: {
        notEmpty: { msg: 'productId wymagane.' },
      },
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'supplier_id',
    },
    leadDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'lead_days',
      validate: {
        min: { args: [0], msg: 'leadDays >= 0' },
        max: { args: [365], msg: 'leadDays <= 365' },
      },
    },
  },
  {
    sequelize,
    modelName: 'ProductSupplier',
    tableName: 'product_suppliers',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['supplier_id', 'product_id'] }],
  },
);

// supplier ma wiele productSupplier, productSupplier nalezy do suppliera
Supplier.hasMany(ProductSupplier, { foreignKey: 'supplierId', as: 'productLinks' });
ProductSupplier.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
