'use client';

import { useState, useEffect } from 'react';
import { getPaymentNotifications } from '@/lib/api';
import { PaymentNotification } from '@/lib/types';
import DashboardLayout from '@/components/admin/DashboardLayout';
import NotificationsTable from '@/components/admin/NotificationsTable';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getPaymentNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification._id === notificationId 
        ? { ...notification, status: 'READ' as const }
        : notification
    ));
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Payment Notifications</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all payment notifications in the system.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="text-center">Loading notifications...</div>
          </div>
        ) : error ? (
          <div className="mt-8 text-center text-red-600">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">No notifications found</div>
        ) : (
          <NotificationsTable 
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 