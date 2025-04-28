'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import UserDetails from '@/components/admin/UserDetails';
import UserOrders from '@/components/admin/UserOrders';
import { getUserDetails } from '@/lib/api';
import { User, Order } from '@/lib/types';

export default function UserDetailsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const data = await getUserDetails(params.id as string);
        setUser(data.user);
        setOrders(data.orders);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUserDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div>User not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UserDetails user={user} />
        <UserOrders orders={orders} />
      </div>
    </DashboardLayout>
  );
} 