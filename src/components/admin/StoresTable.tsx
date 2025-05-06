"use client";

import { useState, useEffect } from "react";
import {
  getStores,
  updateStoreStatus,
  getStorePaymentDetails,
  updateStoreOrder,
  bulkUpdateStoreOrder,
} from "@/lib/api";
import {
  Store,
  StorePagination,
  StorePaymentDetails,
  StoreContactInfo,
  StoreOrderUpdateRequest,
} from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function StoresTable() {
  const [stores, setStores] = useState<Store[]>([]);
  const [pagination, setPagination] = useState<StorePagination>({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "ACTIVE",
    category: "",
    search: "",
  });
  const [selectedStore, setSelectedStore] = useState<{
    storeId: string;
    storeName: string;
    paymentDetails: StorePaymentDetails;
    contactInfo: StoreContactInfo;
  } | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedStoreForOrder, setSelectedStoreForOrder] =
    useState<Store | null>(null);
  const [orderData, setOrderData] = useState<StoreOrderUpdateRequest>({
    displayOrder: 0,
    isFeatured: false,
    featuredUntil: "",
    adminNotes: "",
  });
  const [showBulkOrderModal, setShowBulkOrderModal] = useState(false);
  const [bulkOrderData, setBulkOrderData] = useState<
    { storeId: string; displayOrder: number }[]
  >([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      setError(null);
      if (!filters.search) setLoading(true);
      const data = await getStores(filters);
      setStores(data.stores);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    storeId: string,
    newStatus: "ACTIVE" | "SUSPENDED"
  ) => {
    try {
      const updatedStore = await updateStoreStatus(storeId, newStatus);
      setStores(
        stores.map((store) => (store._id === storeId ? updatedStore : store))
      );
    } catch (error) {
      console.error("Failed to update store status:", error);
    }
  };

  const handleViewPaymentDetails = async (storeId: string) => {
    try {
      const data = await getStorePaymentDetails(storeId);
      setSelectedStore(data);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
    }
  };

  const handleUpdateStoreOrder = async () => {
    if (!selectedStoreForOrder) return;

    try {
      const updatedStore = await updateStoreOrder(
        selectedStoreForOrder._id,
        orderData
      );
      const convertedStore: Store = {
        ...updatedStore,
        userId: {
          _id: updatedStore.userId,
          email: selectedStoreForOrder.userId.email,
        },
      };
      setStores(
        stores.map((store) =>
          store._id === selectedStoreForOrder._id ? convertedStore : store
        )
      );
      setShowOrderModal(false);
    } catch (error) {
      console.error("Failed to update store order:", error);
    }
  };

  const handleOpenOrderModal = (store: Store) => {
    setSelectedStoreForOrder(store);
    setOrderData({
      displayOrder: store.displayOrder || 0,
      isFeatured: store.isFeatured || false,
      featuredUntil: store.featuredUntil || "",
      adminNotes: store.adminNotes || "",
    });
    setShowOrderModal(true);
  };

  const handleBulkOrderUpdate = async () => {
    try {
      setIsUpdating(true);
      await bulkUpdateStoreOrder(bulkOrderData);
      setShowBulkOrderModal(false);
      fetchStores(); // Refresh the stores list
    } catch (error) {
      console.error("Failed to update store orders:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenBulkOrderModal = () => {
    // Initialize bulk order data with current store orders
    const initialData = stores.map((store) => ({
      storeId: store._id,
      displayOrder: store.displayOrder || 0,
    }));
    setBulkOrderData(initialData);
    setShowBulkOrderModal(true);
  };

  const renderStatusBadge = (status: Store["status"]) => {
    const statusColors: Record<Store["status"], string> = {
      ACTIVE: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      SUSPENDED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Stores Management
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={handleOpenBulkOrderModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Bulk Update Order
          </button>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-2 py-1"
            style={{ color: "black" }}
          >
            <option value="ACTIVE">Active Stores</option>
            <option value="PENDING">Pending Stores</option>
            <option value="SUSPENDED">Suspended Stores</option>
          </select>

          <input
            type="text"
            placeholder="Search stores..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border rounded px-2 py-1"
            style={{ color: "black" }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Store Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Metrics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stores.map((store) => (
              <tr
                key={store._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {store.storeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {store.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {store.userId.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {store.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Orders: {store.metrics.totalOrders}</div>
                  <div>
                    Revenue: {formatCurrency(store.metrics.totalRevenue)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(store.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {store.isFeatured ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Regular
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleOpenOrderModal(store)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Update Order
                    </button>
                    <button
                      onClick={() => handleViewPaymentDetails(store._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Payment Details
                    </button>
                    {store.status === "ACTIVE" && (
                      <button
                        onClick={() =>
                          handleStatusChange(store._id, "SUSPENDED")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Suspend
                      </button>
                    )}
                    {store.status === "SUSPENDED" && (
                      <button
                        onClick={() => handleStatusChange(store._id, "ACTIVE")}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </button>
                    )}
                    {store.status === "PENDING" && (
                      <button
                        onClick={() => handleStatusChange(store._id, "ACTIVE")}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedStore && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Payment Details - {selectedStore.storeName}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Bank Details
                </h4>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Account Name:</span>{" "}
                    {selectedStore.paymentDetails.accountName}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Account Number:</span>{" "}
                    {selectedStore.paymentDetails.accountNumber}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Bank Name:</span>{" "}
                    {selectedStore.paymentDetails.bankName}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Contact Information
                </h4>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedStore.contactInfo.email}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedStore.contactInfo.phone}
                  </p>
                  {selectedStore.contactInfo.whatsapp && (
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">WhatsApp:</span>{" "}
                      {selectedStore.contactInfo.whatsapp}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Order Modal */}
      {showOrderModal && selectedStoreForOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Update Store Order
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Store: {selectedStoreForOrder.storeName}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Display Order */}
                <div className="bg-gray-200 rounded-lg p-4 border border-gray-300 shadow-sm">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Display Order
                    </label>
                    <p className="mt-1 text-sm text-gray-700">
                      Lower numbers will appear first in the store listing
                    </p>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={orderData.displayOrder}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setOrderData({
                        ...orderData,
                        displayOrder: value ? parseInt(value) : 0,
                      });
                    }}
                    className="block w-full px-3 py-2 bg-white border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>

                {/* Featured Status */}
                <div className="bg-gray-200 rounded-lg p-4 border border-gray-300 shadow-sm">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Featured Status
                    </label>
                    <p className="mt-1 text-sm text-gray-700">
                      Featured stores appear prominently in the marketplace
                    </p>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={orderData.isFeatured}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-400 rounded"
                    />
                    <label
                      htmlFor="isFeatured"
                      className="ml-2 text-sm font-medium text-gray-900"
                    >
                      Featured Store
                    </label>
                  </div>

                  {orderData.isFeatured && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Featured Until
                      </label>
                      <input
                        type="datetime-local"
                        value={
                          orderData.featuredUntil
                            ? new Date(orderData.featuredUntil)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            featuredUntil: e.target.value,
                          })
                        }
                        className="block w-full px-3 py-2 bg-white border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                      />
                      <p className="mt-2 text-sm text-gray-700">
                        Set when the featured status should expire
                      </p>
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div className="bg-gray-200 rounded-lg p-4 border border-gray-300 shadow-sm">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900">
                      Admin Notes
                    </label>
                    <p className="mt-1 text-sm text-gray-700">
                      Internal notes for administrative purposes
                    </p>
                  </div>
                  <textarea
                    value={orderData.adminNotes || ""}
                    onChange={(e) =>
                      setOrderData({ ...orderData, adminNotes: e.target.value })
                    }
                    rows={3}
                    className="block w-full px-3 py-2 bg-white border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    placeholder="Add any notes about this store..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-200 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t border-gray-300">
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStoreOrder}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Order Modal */}
      {showBulkOrderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Bulk Update Store Order
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update display order for multiple stores
                </p>
              </div>
              <button
                onClick={() => setShowBulkOrderModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {bulkOrderData.map((store, index) => {
                  const storeInfo = stores.find((s) => s._id === store.storeId);
                  return (
                    <div
                      key={store.storeId}
                      className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {storeInfo?.storeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {storeInfo?.category}
                        </p>
                      </div>
                      <div className="w-32">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={store.displayOrder}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            const newData = [...bulkOrderData];
                            newData[index].displayOrder = value
                              ? parseInt(value)
                              : 0;
                            setBulkOrderData(newData);
                          }}
                          className="block w-full px-3 py-2 bg-white border border-gray-400 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowBulkOrderModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkOrderUpdate}
                disabled={isUpdating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={!pagination.hasMore}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(filters.page - 1) * filters.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(filters.page * filters.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() =>
                  setFilters({ ...filters, page: filters.page - 1 })
                }
                disabled={filters.page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
                disabled={!pagination.hasMore}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
