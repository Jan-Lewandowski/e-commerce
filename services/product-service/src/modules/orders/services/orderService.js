import { randomUUID } from 'node:crypto';

import db from '../../../db/knex.js';
import * as orderRepoKnex from '../repositories/orderRepository.knex.js';
import * as orderRepoPg from '../repositories/orderRepository.pg.js';
import { HttpError } from '../../../utils/httpError.js';

const emptyDestination = {
  name: '',
  street: '',
  city: '',
  zipCode: '',
  phone: '',
  email: '',
};

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'Zamowienie musi zawierac przynajmniej jeden produkt.');
  }
  return items.map((item) => ({
    productId: item.productId || item.product?.id,
    quantity: Number(item.quantity),
  }));
}

//transakcja, lock wierszzy zeby uniknac wyprzedazy, update stocku i insert order i order items
export async function createOrder(payload, user) {
  const normalized = normalizeItems(payload.items);

  return db.transaction(async (trx) => {
    const enriched = [];
    for (const { productId, quantity } of normalized) {
      if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
        throw new HttpError(400, 'Kazdy produkt wymaga prawidlowego id i ilosci.');
      }

      const product = await trx('products').where({ id: productId }).forUpdate().first();

      if (!product) {
        throw new HttpError(404, `Nie znaleziono produktu ${productId}`);
      }
      if (quantity > Number(product.stock)) {
        throw new HttpError(409, 'Wybrana ilosc produktu jest obecnie niedostepna.');
      }

      await trx('products').where({ id: productId }).update({ stock: Number(product.stock) - quantity });

      enriched.push({
        product,
        quantity,
        lineTotal: Number(product.price) * quantity,
      });
    }

    const destination = payload.destination || payload.orderDetails?.destination || emptyDestination;
    const email = user?.email || payload.email || destination.email || '';
    const totalAmount = enriched.reduce((sum, item) => sum + item.lineTotal, 0);

    const order = {
      orderId: randomUUID(),
      email,
      createdAt: new Date().toISOString(),
      status: 'completed',
      items: enriched.map(({ product, quantity, lineTotal }) => ({
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: Number(product.price),
        currency: 'PLN',
        lineTotal,
      })),
      totalAmount,
      paymentMethod: payload.paymentMethod || payload.orderDetails?.paymentMethod || '',
      deliveryMethod: payload.deliveryMethod || payload.orderDetails?.deliveryMethod || '',
      shipper: payload.shipper || payload.orderDetails?.shipper || null,
      destination,
    };

    await orderRepoKnex.insertOrder(trx, order);
    return order;
  });
}

export async function getOrdersForUser(user) {
  if (!user?.email) {
    throw new HttpError(401, 'Brak autoryzacji.');
  }
  return orderRepoPg.findOrdersByEmail(user.email);
}

export async function getOrderById(orderId, user) {
  const order = await orderRepoPg.findOrderById(orderId);
  if (!order) {
    throw new HttpError(404, 'Nie znaleziono zamowienia.');
  }
  if (user?.role !== 'admin' && order.email !== user?.email) {
    throw new HttpError(403, 'Dostep zabroniony.');
  }
  return order;
}

export function getAllOrders() {
  return orderRepoPg.findAllOrders();
}
