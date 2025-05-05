"use client";

import { useEffect, useState } from "react";
import { getOrderDetails, updateOrderStatus } from "@/lib/api";
import { OrderDetails as OrderDetailsType, OrderStatus } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetails(orderId);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrderDetails(); // Refresh order details after status update
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Order Details
            </h2>
            <p className="text-sm text-gray-500">
              Tracking Number: {order.trackingNumber}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "CONFIRMED"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "READY_FOR_PICKUP"
                  ? "bg-orange-100 text-orange-800"
                  : order.status === "PICKED_UP"
                  ? "bg-indigo-100 text-indigo-800"
                  : order.status === "IN_TRANSIT"
                  ? "bg-purple-100 text-purple-800"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
            <span className="text-sm text-gray-500">
              Created: {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Consumer Details */}
        {order.consumer && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Consumer Information
            </h3>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.consumer.firstName} {order.consumer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.consumer.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.consumer.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Items
          </h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.productDescription}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {formatCurrency(item.price)}</p>
                      <p>Total: {formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {item.store.storeName}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>{item.store.contactInfo.phone}</p>
                      <p>{item.store.contactInfo.email}</p>
                      {item.store.contactInfo.whatsapp && (
                        <p>WhatsApp: {item.store.contactInfo.whatsapp}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delivery Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Pickup Address</h4>
              <div className="text-sm text-gray-500">
                <p>
                  {
                    order.deliveryDetails.pickupAddress.manualAddress
                      .recipientName
                  }
                </p>
                <p>
                  {order.deliveryDetails.pickupAddress.manualAddress.street}
                </p>
                <p>
                  {order.deliveryDetails.pickupAddress.manualAddress.city},{" "}
                  {order.deliveryDetails.pickupAddress.manualAddress.state}
                </p>
                <p>
                  {order.deliveryDetails.pickupAddress.manualAddress.country}{" "}
                  {order.deliveryDetails.pickupAddress.manualAddress.postalCode}
                </p>
                <p className="mt-2">
                  {
                    order.deliveryDetails.pickupAddress.manualAddress
                      .recipientPhone
                  }
                </p>
                <p>
                  {
                    order.deliveryDetails.pickupAddress.manualAddress
                      .recipientEmail
                  }
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Delivery Address
              </h4>
              <div className="text-sm text-gray-500">
                <p>{order.deliveryDetails.deliveryAddress.recipientName}</p>
                <p>{order.deliveryDetails.deliveryAddress.street}</p>
                <p>
                  {order.deliveryDetails.deliveryAddress.city},{" "}
                  {order.deliveryDetails.deliveryAddress.state}
                </p>
                <p>
                  {order.deliveryDetails.deliveryAddress.country}{" "}
                  {order.deliveryDetails.deliveryAddress.postalCode}
                </p>
                <p className="mt-2">
                  {order.deliveryDetails.deliveryAddress.recipientPhone}
                </p>
                <p>{order.deliveryDetails.deliveryAddress.recipientEmail}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500">Package Size</p>
              <p className="text-sm text-gray-900">
                {order.deliveryDetails.packageSize}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500">Delivery Type</p>
              <p className="text-sm text-gray-900">
                {order.deliveryDetails.isExpressDelivery
                  ? "Express"
                  : "Standard"}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500">
                Estimated Delivery
              </p>
              <p className="text-sm text-gray-900">
                {formatDate(order.deliveryDetails.estimatedDeliveryDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Payment Details
          </h3>
          <div className="border rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Product Total</span>
                <span className="text-gray-900">
                  {formatCurrency(
                    order.paymentDetails.priceBreakdown.productTotal
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="text-gray-900">
                  {formatCurrency(
                    order.paymentDetails.priceBreakdown.deliveryFee
                  )}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(order.paymentDetails.priceBreakdown.total)}
                </span>
              </div>
            </div>
          </div>
          {order.paymentDetails.receipts.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Payment Receipts
              </h4>
              <div className="space-y-2">
                {order.paymentDetails.receipts.map((receipt, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    {/* Add receipt details here based on your receipt structure */}
                    <pre className="text-sm text-gray-500 overflow-x-auto">
                      {JSON.stringify(receipt, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Update Actions */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Update Status
          </h3>
          <div className="flex flex-wrap gap-2">
            {order.status === "PENDING" && (
              <button
                onClick={() => handleStatusUpdate("CONFIRMED")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm Order
              </button>
            )}
            {order.status === "CONFIRMED" && (
              <button
                onClick={() => handleStatusUpdate("READY_FOR_PICKUP")}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Mark Ready for Pickup
              </button>
            )}
            {order.status === "READY_FOR_PICKUP" && (
              <button
                onClick={() => handleStatusUpdate("PICKED_UP")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Mark Picked Up
              </button>
            )}
            {order.status === "PICKED_UP" && (
              <button
                onClick={() => handleStatusUpdate("IN_TRANSIT")}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Mark In Transit
              </button>
            )}
            {order.status === "IN_TRANSIT" && (
              <button
                onClick={() => handleStatusUpdate("DELIVERED")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
