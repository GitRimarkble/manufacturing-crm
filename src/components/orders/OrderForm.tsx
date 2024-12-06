import { useForm } from 'react-hook-form';
import { Order } from '@/types/orders';

interface OrderFormProps {
  onAddOrder: (order: Order) => void;
}

export function OrderForm({ onAddOrder }: OrderFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Order>();

  const onSubmit = (data: Order) => {
    onAddOrder(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
        <input
          id="product"
          {...register('product', { required: 'Product is required' })}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        {errors.product && <span className="text-red-500 text-sm">{errors.product.message}</span>}
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          id="quantity"
          type="number"
          {...register('quantity', { required: 'Quantity is required' })}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity.message}</span>}
      </div>
      <div>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Add Order
        </button>
      </div>
    </form>
  );
}
