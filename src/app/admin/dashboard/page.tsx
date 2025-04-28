import DashboardLayout from '@/components/admin/DashboardLayout';
import DashboardStats from '@/components/admin/DashboardStats';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <DashboardStats />
      </div>
    </DashboardLayout>
  );
} 