//model supplier z walidacja i hookiem
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../db/sequelize.js';

export class Supplier extends Model { }

Supplier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nazwa dostawcy nie moze byc pusta.' },
        len: { args: [2, 120], msg: 'Nazwa: 2-120 znakow.' },
      },
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Email dostawcy musi byc poprawny.' },
      },
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 5.0,
      validate: {
        min: { args: [0.0], msg: 'Rating >= 0.0' },
        max: { args: [5.0], msg: 'Rating <= 5.0' },
      },
    },
    contactName: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'contact_name',
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Supplier',
    tableName: 'suppliers',
    timestamps: true,
    underscored: true,
  },
);

//hook normalizuje dane
Supplier.addHook('beforeValidate', (supplier) => {
  if (supplier.email && typeof supplier.email === 'string') {
    supplier.email = supplier.email.toLowerCase().trim();
  }
  if (supplier.name && typeof supplier.name === 'string') {
    supplier.name = supplier.name.trim();
  }
  if (supplier.contactName && typeof supplier.contactName === 'string') {
    supplier.contactName = supplier.contactName.trim();
  }
  if (supplier.phone && typeof supplier.phone === 'string') {
    supplier.phone = supplier.phone.trim();
  }
  if (supplier.address && typeof supplier.address === 'string') {
    supplier.address = supplier.address.trim();
  }
});
