'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import OrderStats from '@/components/admin/OrderStats';
import OrdersTable from '@/components/admin/OrdersTable';

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
        <OrderStats />
        <OrdersTable />
      </div>
    </DashboardLayout>
  );
} 