import { randomUUID } from 'node:crypto';

import * as orderRepository from '../repositories/orderRepository.js';
import * as productRepository from '../repositories/productRepository.js';
import { HttpError } from '../utils/httpError.js';

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
    throw new HttpError(400, 'Order must contain at least one item');
  }

  return items.map((item) => ({
    productId: item.productId || item.product?.id,
    quantity: Number(item.quantity),
  }));
}

export function createOrder(payload, user) {
  const normalizedItems = normalizeItems(payload.items);

  const completedItems = normalizedItems.map(({ productId, quantity }) => {
    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw new HttpError(400, 'Every item needs a valid productId and quantity');
    }

    const product = productRepository.getProductById(productId);

    if (!product) {
      throw new HttpError(404, `Product ${productId} not found`);
    }

    if (quantity > product.stock) {
      throw new HttpError(409, `Not enough stock for ${product.name}`);
    }

    return {
      product,
      quantity,
      lineTotal: product.price * quantity,
    };
  });

  completedItems.forEach(({ product, quantity }) => {
    productRepository.updateProductStock(product.id, product.stock - quantity);
  });

  const destination = payload.destination || payload.orderDetails?.destination || emptyDestination;
  const email = user?.email || payload.email || destination.email || '';
  const username = user?.username || payload.username || destination.name || 'Klient';
  const totalAmount = completedItems.reduce((total, item) => total + item.lineTotal, 0);

  const order = {
    orderId: randomUUID(),
    username,
    email,
    createdAt: new Date().toISOString(),
    status: 'completed',
    items: completedItems.map(({ product, quantity, lineTotal }) => ({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price,
      currency: 'PLN',
      lineTotal,
    })),
    totalAmount,
    paymentMethod: payload.paymentMethod || payload.orderDetails?.paymentMethod || '',
    deliveryMethod: payload.deliveryMethod || payload.orderDetails?.deliveryMethod || '',
    shipper: payload.shipper || payload.orderDetails?.shipper,
    destination,
  };

  return orderRepository.createOrder(order);
}

export function getOrdersForUser(user) {
  if (!user?.email) {
    throw new HttpError(401, 'Unauthorized');
  }

  return orderRepository.getOrdersByEmail(user.email);
}

export function getOrderById(orderId, user) {
  const order = orderRepository.getOrderById(orderId);

  if (!order) {
    throw new HttpError(404, 'Order not found');
  }

  if (user?.role !== 'admin' && order.email !== user?.email) {
    throw new HttpError(403, 'Forbidden');
  }

  return order;
}

export function getAllOrders() {
  return orderRepository.getOrders();
}
