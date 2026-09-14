/**
 * orders.js
 * -----------------------------------------------------------------------
 * Demo order history, stored in localStorage like everything else here.
 * checkout.js creates an order when the (mock) payment "succeeds";
 * account.js reads the signed-in visitor's own orders; admin.js reads
 * every order to build the admin overview. No backend, so orders placed
 * on one device/browser won't show up on another.
 */

const ORDERS_KEY = 'affinity_orders';

export function getAllOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function updateOrderStatus(orderId, status) {
  const orders = getAllOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = status;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
}

export function getOrdersForUser(userId) {
  return getAllOrders()
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** { userId, items: [{id,title,price,qty}], total, shipping: {fullName, email, address, city, state, zip, country} } */
export function createOrder({ userId, items, total, shipping }) {
  const orders = getAllOrders();
  const order = {
    id: `AFF-${Date.now().toString().slice(-8)}`,
    userId: userId || null,
    items,
    total,
    shipping,
    status: 'paid',
    date: new Date().toISOString(),
  };
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
}
