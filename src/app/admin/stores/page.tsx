'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import StoresTable from '@/components/admin/StoresTable';

export default function StoresPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Stores Management</h1>
        <StoresTable />
      </div>
    </DashboardLayout>
  );
} 