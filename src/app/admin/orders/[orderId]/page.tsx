'use client';

import { useParams } from 'next/navigation';
import OrderDetails from '@/components/admin/OrderDetails';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails orderId={orderId} />
    </div>
  );
} 