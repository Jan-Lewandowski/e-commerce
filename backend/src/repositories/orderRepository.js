import { orders } from '../../data.js';

export function createOrder(order) {
  orders.unshift(order);
  return order;
}

export function getOrders() {
  return orders;
}

export function getOrderById(orderId) {
  return orders.find((order) => order.orderId === orderId) || null;
}

export function getOrdersByEmail(email) {
  return orders.filter((order) => order.email.toLowerCase() === email.toLowerCase());
}
