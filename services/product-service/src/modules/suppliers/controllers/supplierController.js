import * as supplierService from '../services/supplierService.js';
import { HttpError } from '../../../utils/httpError.js';

export async function list(_req, res, next) {
  try {
    res.json(await supplierService.listSuppliers());
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new HttpError(400, 'Nieprawidlowe id.');
    res.json(await supplierService.getSupplierById(id));
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new HttpError(400, 'Nieprawidlowe id.');
    res.json(await supplierService.getProductsForSupplier(id));
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { name, email, rating, contactName, phone, address, productIds, leadDays } = req.body || {};
    if (!name || !email) throw new HttpError(400, 'name i email sa wymagane.');
    const supplier = await supplierService.createSupplierWithLinks({
      supplier: { name, email, rating, contactName, phone, address },
      productIds: Array.isArray(productIds) ? productIds : [],
      leadDays: Number.isFinite(Number(leadDays)) ? Number(leadDays) : 3,
    });
    res.status(201).json(supplier);
  } catch (err) {
    if (err && err.name && err.name.startsWith('Sequelize')) {
      const message = err.errors?.map((e) => e.message).join('; ') || err.message;
      return next(new HttpError(err.name.includes('Unique') ? 409 : 400, message));
    }
    next(err);
  }
}
