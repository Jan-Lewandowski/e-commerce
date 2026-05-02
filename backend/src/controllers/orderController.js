import * as orderService from '../services/orderService.js';

export function createOrder(req, res) {
  const order = orderService.createOrder(req.body, req.auth.user);
  res.status(201).json(order);
}

export function getMyOrders(req, res) {
  res.json(orderService.getOrdersForUser(req.auth.user));
}

export function getOrderById(req, res) {
  res.json(orderService.getOrderById(req.params.orderId, req.auth.user));
}

export function getAdminOrders(_req, res) {
  res.json(orderService.getAllOrders());
}
