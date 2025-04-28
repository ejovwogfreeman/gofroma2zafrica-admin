import { Order } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function UserOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Order History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          User's delivery orders and their status.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Tracking Number
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Items
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Delivery Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {order.trackingNumber}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'CONFIRMED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-1">
                      <span>{item.quantity}x</span>
                      <span>{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-gray-400">({item.description})</span>
                      )}
                    </div>
                  ))}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {formatCurrency(order.price)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDate(order.estimatedDeliveryDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 