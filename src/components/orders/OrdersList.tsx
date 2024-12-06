import { Order } from '@/types/orders';

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="border p-4 mb-2 rounded">
            <p>Product: {order.product}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
