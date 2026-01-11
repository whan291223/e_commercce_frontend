import React, { useState, useEffect } from 'react';

// Mock API - replace with your actual OrderApi
const OrderApi = {
  fetchOrders: async () => {
    // Replace with: return await fetch('/api/v1/orders').then(r => r.json());
    return {
      data: [
        {
          id: 1,
          user_id: 5,
          username: "john_doe",
          total_price_baths: 25000,
          status: "paid",
          stripe_session_id: "cs_test_abc123",
          created_at: "2025-01-10T14:30:00",
          items: [
            { product_name: "Laptop", quantity: 1, price_at_purchase_baths: 25000 }
          ]
        },
        {
          id: 2,
          user_id: 8,
          username: "jane_smith",
          total_price_baths: 5000,
          status: "pending",
          stripe_session_id: "cs_test_xyz789",
          created_at: "2025-01-11T09:15:00",
          items: [
            { product_name: "Mouse", quantity: 2, price_at_purchase_baths: 2500 }
          ]
        }
      ]
    };
  },
  
  updateOrderStatus: async (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // Replace with actual API call
    return { success: true };
  }
};

function AdminOrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderApi.fetchOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const ok = window.confirm(`Change order status to "${newStatus}"?`);
    if (!ok) return;

    try {
      await OrderApi.updateOrderStatus(orderId, newStatus);
      loadOrders(); // Refresh
    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "date_desc":
        return new Date(b.created_at) - new Date(a.created_at);
      case "date_asc":
        return new Date(a.created_at) - new Date(b.created_at);
      case "price_desc":
        return b.total_price_baths - a.total_price_baths;
      case "price_asc":
        return a.total_price_baths - b.total_price_baths;
      default:
        return 0;
    }
  });

  const formatPrice = (priceBaths) => `$${(priceBaths / 100).toFixed(2)}`;
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === "paid").length,
    pending: orders.filter(o => o.status === "pending").length,
    revenue: orders.filter(o => o.status === "paid")
      .reduce((sum, o) => sum + o.total_price_baths, 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Order Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Paid Orders</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paid}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(stats.revenue)}
          </p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="price_desc">Highest Price</option>
            <option value="price_asc">Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {order.username || `User #${order.user_id}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {formatPrice(order.total_price_baths)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {expandedOrder === order.id ? "Hide" : "Details"}
                      </button>

                      {order.status === "paid" && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, "shipped")}
                          className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                        >
                          Mark Shipped
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, "delivered")}
                          className="px-3 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 bg-gray-50 dark:bg-gray-700/30">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            Order Items:
                          </h4>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded"
                              >
                                <span className="text-gray-800 dark:text-gray-200">
                                  {item.product_name} × {item.quantity}
                                </span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                  {formatPrice(item.price_at_purchase_baths * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Stripe Session: {order.stripe_session_id}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sortedOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrderTable;