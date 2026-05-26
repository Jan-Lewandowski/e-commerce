import pool from '../../../db/pool.js';

function mapOrderRow(row) {
  if (!row) return null;
  return {
    orderId: row.order_id,
    email: row.email,
    createdAt: row.created_at,
    status: row.status,
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method,
    deliveryMethod: row.delivery_method,
    shipper: row.shipper,
    destination: row.destination,
  };
}

function mapItemRow(row) {
  return {
    productId: row.product_id,
    name: row.name,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    currency: 'PLN',
    lineTotal: Number(row.line_total),
  };
}

async function attachItems(orders) {
  if (orders.length === 0) return orders;
  const ids = orders.map((o) => o.orderId);
  const { rows } = await pool.query(
    `SELECT order_id, product_id, name, quantity, unit_price, line_total
       FROM order_items
      WHERE order_id = ANY($1::uuid[])`,
    [ids],
  );
  const byOrder = new Map(ids.map((id) => [id, []]));
  for (const row of rows) {
    byOrder.get(row.order_id).push(mapItemRow(row));
  }
  return orders.map((order) => ({ ...order, items: byOrder.get(order.orderId) || [] }));
}

export async function findOrderById(orderId) {
  const { rows } = await pool.query(
    `SELECT order_id, email, created_at, status, total_amount,
            payment_method, delivery_method, shipper, destination
       FROM orders
      WHERE order_id = $1`,
    [orderId],
  );
  const order = mapOrderRow(rows[0]);
  if (!order) return null;
  const [withItems] = await attachItems([order]);
  return withItems;
}
//parametryzowane zapytanie
export async function findOrdersByEmail(email) {
  const { rows } = await pool.query(
    `SELECT order_id, email, created_at, status, total_amount,
            payment_method, delivery_method, shipper, destination
       FROM orders
      WHERE LOWER(email) = LOWER($1)
   ORDER BY created_at DESC`,
    [email],
  );
  const orders = rows.map(mapOrderRow);
  return attachItems(orders);
}

export async function findAllOrders() {
  const { rows } = await pool.query(
    `SELECT order_id, email, created_at, status, total_amount,
            payment_method, delivery_method, shipper, destination
       FROM orders
   ORDER BY created_at DESC`,
  );
  return attachItems(rows.map(mapOrderRow));
}
