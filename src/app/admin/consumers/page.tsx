'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import ConsumersTable from '@/components/admin/ConsumersTable';
import ConsumerStats from '@/components/admin/ConsumerStats';

export default function ConsumersPage() {
  const [searchParams, setSearchParams] = useState({
    status: '',
    search: '',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Consumers Management</h1>
        <ConsumerStats />
        <ConsumersTable searchParams={searchParams} setSearchParams={setSearchParams} />
      </div>
    </DashboardLayout>
  );
} 