'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import ZonesTable from '@/components/admin/ZonesTable';

export default function ZonesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Zones Management</h1>
        <ZonesTable />
      </div>
    </DashboardLayout>
  );
} 