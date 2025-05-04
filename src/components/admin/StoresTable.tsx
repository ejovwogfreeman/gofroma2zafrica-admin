"use client";

import { useState, useEffect } from "react";
import { getStores, updateStoreStatus } from "@/lib/api";
import { Store, StorePagination } from "@/lib/types";
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

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
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
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-2 py-1 text-dark"
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
            className="border rounded px-2 py-1 text-dark"
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
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
