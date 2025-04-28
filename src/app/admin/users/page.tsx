'use client';

import DashboardLayout from '@/components/admin/DashboardLayout';
import UsersTable from '@/components/admin/UsersTable';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
        <UsersTable />
      </div>
    </DashboardLayout>
  );
} 