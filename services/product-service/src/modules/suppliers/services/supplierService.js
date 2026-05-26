//transkacja, eager loading i hook 
import sequelize from '../../../db/sequelize.js';
import * as productRepository from '../../catalog/repositories/productRepository.js';
import { Supplier } from '../models/Supplier.js';
import { ProductSupplier } from '../models/ProductSupplier.js';
import { HttpError } from '../../../utils/httpError.js';

function toSupplierSummary(supplier) {
  if (!supplier) return null;
  return {
    id: supplier.id,
    name: supplier.name,
    email: supplier.email,
    rating: Number(supplier.rating),
    contactName: supplier.contactName,
    phone: supplier.phone,
    address: supplier.address,
  };
}

//eager loading
export async function listSuppliers() {
  return Supplier.findAll({
    include: [{ model: ProductSupplier, as: 'productLinks' }],
    order: [['name', 'ASC']],
  });
}

export async function getSupplierById(id) {
  const supplier = await Supplier.findByPk(id, {
    include: [{ model: ProductSupplier, as: 'productLinks' }],
  });
  if (!supplier) {
    throw new HttpError(404, 'Nie znaleziono dostawcy.');
  }
  return supplier;
}

export async function getPrimarySupplierForProduct(productId) {
  const link = await ProductSupplier.findOne({
    where: { productId },
    include: [{ model: Supplier, as: 'supplier' }],
    order: [
      ['leadDays', 'ASC'],
      ['supplierId', 'ASC'],
    ],
  });

  return toSupplierSummary(link?.supplier);
}

export async function getProductsForSupplier(id) {
  const supplier = await getSupplierById(id);
  const productIds = [
    ...new Set((supplier.productLinks || []).map((link) => link.productId)),
  ];

  return productRepository.getProductsByIds(productIds);
}

// transakcja - utworzenie supplier i powiazania product supplier
export async function createSupplierWithLinks({ supplier, productIds = [], leadDays = 3 }) {
  return sequelize.transaction(async (t) => {
    const created = await Supplier.create(supplier, { transaction: t });

    if (productIds.length) {
      await ProductSupplier.bulkCreate(
        productIds.map((pid) => ({
          supplierId: created.id,
          productId: pid,
          leadDays,
        })),
        { transaction: t, validate: true },
      );
    }

    return Supplier.findByPk(created.id, {
      include: [{ model: ProductSupplier, as: 'productLinks' }],
      transaction: t,
    });
  });
}
