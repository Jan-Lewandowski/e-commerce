import * as orderService from '../services/orderService.js';

export async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body, req.auth.user);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    res.json(await orderService.getOrdersForUser(req.auth.user));
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    res.json(await orderService.getOrderById(req.params.orderId, req.auth.user));
  } catch (err) {
    next(err);
  }
}

export async function getAdminOrders(_req, res, next) {
  try {
    res.json(await orderService.getAllOrders());
  } catch (err) {
    next(err);
  }
}
