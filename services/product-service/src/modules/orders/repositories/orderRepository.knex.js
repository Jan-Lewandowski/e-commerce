import db from '../../../db/knex.js';

export async function insertOrder(trx, order) {
  await trx('orders').insert({
    order_id: order.orderId,
    email: order.email,
    created_at: order.createdAt,
    status: order.status,
    total_amount: order.totalAmount,
    payment_method: order.paymentMethod,
    delivery_method: order.deliveryMethod,
    shipper: order.shipper,
    destination: JSON.stringify(order.destination),
  });

  if (order.items.length) {
    await trx('order_items').insert(
      order.items.map((item) => ({
        order_id: order.orderId,
        product_id: item.productId,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
      })),
    );
  }
}

export function transaction(work) {
  return db.transaction(work);
}
