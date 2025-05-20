// Admin Types
export interface Admin {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    admin: Admin;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  isEmailVerified: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  verificationCode?: string;
  verificationCodeExpiry?: string;
}

// Order Types
export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  description?: string;
}

export interface Address {
  _id?: string;
  userId?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  label?: string;
  recipientName?: string;
  recipientPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderStats {
  total: number;
  totalDelivered: number;
  totalPending: number;
  totalInTransit: number;
  totalCancelled: number;
  totalFailedDelivery: number;
  todayOrders: number;
  todayDelivered: number;
  revenue: {
    total: number;
    today: number;
  };
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED_DELIVERY";

export interface Order {
  _id: string;
  userId: string;
  trackingNumber: string;
  status: OrderStatus;
  packageSize: "SMALL" | "MEDIUM" | "LARGE";
  price: number;
  isFragile: boolean;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  items: OrderItem[];
  pickupAddress: Address;
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

// Consumer Types
export interface Consumer {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isEmailVerified: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: {
    favoriteStores: string[];
    preferredCategories: string[];
  };
}

export interface ConsumerStats {
  total: number;
  active: number;
  inactive: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
}

export interface OrderStatusUpdateResponse {
  order: Order;
  emailSent: boolean;
}

export interface Zone {
  _id: string;
  name: string;
  deliveryPrice: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreContactInfo {
  email: string;
  phone: string;
  whatsapp?: string;
}

export interface StoreAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface StoreSettings {
  isVerified: boolean;
  isFeaturedStore: boolean;
  allowRatings: boolean;
}

export interface StoreMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

export interface StorePaymentDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface Store {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  storeName: string;
  description: string;
  category: "FASHION" | "ELECTRONICS" | "OTHER";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  contactInfo: StoreContactInfo;
  address: StoreAddress;
  settings: StoreSettings;
  metrics: StoreMetrics;
  paymentDetails?: StorePaymentDetails;
  createdAt: string;
  updatedAt: string;
  slug: string;
  storeUrl: string;
  isFeatured: boolean;
  displayOrder: number;
  adminNotes?: string;
  featuredUntil?: string;
}

export interface StorePagination {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface StoresResponse {
  stores: Store[];
  pagination: StorePagination;
}

export interface PaymentNotificationDetails {
  orderNumber: string;
  amount: number;
  paymentReference: string;
  consumerName: string;
}

export interface PaymentNotification {
  _id: string;
  orderId: string;
  type: "NEW_PAYMENT";
  status: "READ" | "UNREAD";
  details: PaymentNotificationDetails;
  createdAt: string;
}

export interface PaymentNotificationsResponse {
  notifications: PaymentNotification[];
  total: number;
}

export interface OrderDetails {
  orderId: string;
  trackingNumber: string;
  status: OrderStatus;
  createdAt: string;
  consumer: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  items: {
    productId: string;
    storeId: {
      _id: string;
    };
    quantity: number;
    price: number;
    variantData: any[];
    _id: string;
    productName: string;
    productDescription: string;
    store: {
      storeName: string;
      storeId: string;
      contactInfo: {
        email: string;
        phone: string;
        whatsapp: string;
      };
    };
  }[];
  deliveryDetails: {
    pickupAddress: {
      type: string;
      manualAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        recipientName: string;
        recipientPhone: string;
        recipientEmail: string;
      };
    };
    deliveryAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      recipientName: string;
      recipientPhone: string;
      recipientEmail: string;
    };
    packageSize: "SMALL" | "MEDIUM" | "LARGE";
    isExpressDelivery: boolean;
    estimatedDeliveryDate: string;
  };
  paymentDetails: {
    receipts: any[];
    priceBreakdown: {
      productTotal: number;
      deliveryFee: number;
      total: number;
    };
  };
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationInfo;
}

export interface StoreImage {
  url: string;
  publicId: string;
}

export interface StoreListResponse {
  stores: {
    _id: string;
    userId: string;
    storeName: string;
    description: string;
    category: "FASHION" | "ELECTRONICS" | "OTHER";
    status: "ACTIVE" | "PENDING" | "SUSPENDED";
    contactInfo: StoreContactInfo;
    address: StoreAddress;
    image?: StoreImage;
    settings: StoreSettings;
    metrics: StoreMetrics;
    paymentDetails?: StorePaymentDetails;
    createdAt: string;
    updatedAt: string;
    slug: string;
    storeUrl: string;
    isFeatured: boolean;
    displayOrder: number;
    adminNotes?: string;
    featuredUntil?: string;
  }[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface StoreOrderUpdateRequest {
  displayOrder: number;
  isFeatured: boolean;
  featuredUntil?: string;
  adminNotes?: string;
}

export interface StoreBulkOrderUpdateRequest {
  stores: {
    storeId: string;
    displayOrder: number;
  }[];
}

export interface StoreOrderUpdateResponse {
  contactInfo: StoreContactInfo;
  address: StoreAddress;
  image?: StoreImage;
  settings: StoreSettings;
  metrics: StoreMetrics;
  _id: string;
  userId: string;
  storeName: string;
  description: string;
  category: "FASHION" | "ELECTRONICS" | "OTHER";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  slug: string;
  adminNotes?: string;
  displayOrder: number;
  featuredUntil?: string;
  isFeatured: boolean;
  storeUrl: string;
}
