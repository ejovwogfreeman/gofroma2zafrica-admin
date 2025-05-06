import { LoginCredentials, LoginResponse, User, Order, OrderStats, Zone, Store, StoresResponse, ConsumerStats, OrderStatus, OrderStatusUpdateResponse, OrderDetails, StorePaymentDetails, StoreContactInfo, StoreListResponse, StoreOrderUpdateRequest, StoreOrderUpdateResponse, StoreBulkOrderUpdateRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://logistics-backend-1-s91j.onrender.com';

// Auth APIs
export async function loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

// User APIs
export async function getUsers(page = 1, limit = 10) {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  return data.data;
}

export async function getUserDetails(userId: string): Promise<{ user: User, orders: Order[] }> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch user details');
  const data = await response.json();
  return data.data;
}

// Consumer APIs
export async function getConsumers(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const token = localStorage.getItem('adminToken');
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
    ...(params.status && { status: params.status }),
    ...(params.search && { search: params.search }),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/consumers?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch consumers');
  }

  const data = await response.json();
  return data.data;
}

export async function getConsumerStats(): Promise<ConsumerStats> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/consumers/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch consumer stats');
  const data = await response.json();
  return data.data;
}

// Order APIs
export async function getOrderStats(): Promise<OrderStats> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/orders/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch order stats');
  const data = await response.json();
  return data.data;
}

export async function getOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const token = localStorage.getItem('adminToken');
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
    ...(params.status && { status: params.status }),
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/orders?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const data = await response.json();
  return data.data;
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus,
  notes?: string
): Promise<OrderStatusUpdateResponse> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      status, 
      notes 
    }),
  });

  if (!response.ok) throw new Error('Failed to update order status');
  const data = await response.json();
  return {
    order: data.data.order,
    emailSent: data.data.emailSent
  };
}

export async function getOrderDetails(orderId: string): Promise<OrderDetails> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/receipts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch order details');
  }
  
  const data = await response.json();
  return data.data;
}

// Zone APIs
export async function getZones(): Promise<Zone[]> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/zones`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch zones');
  const data = await response.json();
  return data.data;
}

export async function getActiveZones(): Promise<Zone[]> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/zones/active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch active zones');
  const data = await response.json();
  return data.data;
}

export async function createZone(zoneData: {
  name: string;
  deliveryPrice: number;
  isActive: boolean;
}): Promise<Zone> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/zones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: zoneData.name,
      deliveryPrice: zoneData.deliveryPrice,
      isActive: zoneData.isActive
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(errorData.message || 'Failed to create zone');
  }
  
  const data = await response.json();
  return data.data;
}

export async function updateZone(
  id: string, 
  zoneData: {
    name?: string;
    deliveryPrice?: number;
    description?: string;
    isActive?: boolean;
  }
): Promise<Zone> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/zones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(zoneData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update zone');
  }
  
  const data = await response.json();
  return data.data;
}

export async function deleteZone(id: string): Promise<void> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/zones/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to delete zone');
}

export async function getStores(params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  minRevenue?: number;
  search?: string;
}): Promise<StoresResponse> {
  const token = localStorage.getItem('adminToken');
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/stores?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`Failed to fetch stores: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Add logging to verify the structure
  console.log('Stores API Response:', data);

  // Ensure the response matches the expected structure
  if (!data.success || !data.data) {
    throw new Error('Invalid response structure');
  }

  return data.data;
}

export async function updateStoreStatus(
  storeId: string, 
  status: 'ACTIVE' | 'SUSPENDED'
): Promise<Store> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/stores/${storeId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error('Failed to update store status');
  const data = await response.json();
  return data.data;
}

export async function getPaymentNotifications(params: { page?: number; limit?: number } = {}) {
  const token = localStorage.getItem('adminToken');
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
  });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/notifications/payments?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch payment notifications');
  const data = await response.json();
  return data.data;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/notifications/${notificationId}/mark-read`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to mark notification as read');
}

export async function getStorePaymentDetails(storeId: string): Promise<{
  storeId: string;
  storeName: string;
  paymentDetails: StorePaymentDetails;
  contactInfo: StoreContactInfo;
}> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/stores/${storeId}/payment-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch store payment details');
  }
  
  const data = await response.json();
  return data.data;
}

export async function getStoreList(): Promise<StoreListResponse> {
  const response = await fetch(`${API_BASE_URL}/api/stores/list`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch store list');
  }
  
  const data = await response.json();
  return data.data;
}

export async function updateStoreOrder(
  storeId: string,
  orderData: StoreOrderUpdateRequest
): Promise<StoreOrderUpdateResponse> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/stores/${storeId}/order`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update store order');
  }
  
  const data = await response.json();
  return data.data;
}

export async function bulkUpdateStoreOrder(
  stores: { storeId: string; displayOrder: number }[]
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/api/admin/stores/bulk-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stores }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update store orders');
  }
  
  const data = await response.json();
  return data;
}