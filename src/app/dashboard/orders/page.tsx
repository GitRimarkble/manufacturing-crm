'use client';

import { OrdersList } from '@/components/orders/OrdersList';
import { OrderForm } from '@/components/orders/OrderForm';
import { useState, useEffect } from 'react';
import { Order } from '@/types/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddOrder = async (order: Order) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Failed to add order');

      const newOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="md:grid md:grid-cols-3 md:gap-6" role="region" aria-label="Orders management">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Orders</h3>
            <p className="mt-1 text-sm text-gray-600">
              Manage your orders efficiently.
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <OrderForm onAddOrder={handleAddOrder} />
        </div>
      </div>
      <OrdersList orders={orders} aria-label="List of orders" />
    </div>
  );
}
