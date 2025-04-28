'use client';

import { useState } from 'react';
import { PaymentNotification } from '@/lib/types';
import { markNotificationAsRead } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface NotificationsTableProps {
  notifications: PaymentNotification[];
  onNotificationRead: (id: string) => void;
}

export default function NotificationsTable({ notifications, onNotificationRead }: NotificationsTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setLoading(notificationId);
      await markNotificationAsRead(notificationId);
      onNotificationRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Order Number
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Consumer
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {notifications.map((notification) => (
                  <tr key={notification._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {notification.details.orderNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {notification.details.consumerName || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(notification.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          notification.status === 'UNREAD'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {notification.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {notification.status === 'UNREAD' && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          disabled={loading === notification._id}
                          className="text-gold hover:text-gold-dark"
                        >
                          {loading === notification._id ? 'Marking...' : 'Mark as read'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 