import React, { useState, useEffect } from "react";
import OrderApi from "../../api/OrderApi";

const API_BASE_URL = "http://localhost:8000";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await OrderApi.fetchOrders(token);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleCancelOrder = async (orderId) => {
  //   const ok = window.confirm(
  //     "Are you sure you want to cancel this order? This action cannot be undone."
  //   );
  //   if (!ok) return;

  //   try {
  //     const token = sessionStorage.getItem("jwt_token");
  //     await OrderApi.cancelOrder(orderId, token);
  //     loadOrders(); // Refresh orders
  //     alert("Order cancelled successfully");
  //   } catch (err) {
  //     console.error("Failed to cancel order:", err);
  //     alert(err.response?.data?.detail || "Failed to cancel order");
  //   }
  // };

  const formatPrice = (pricebahts) => `฿ ${(pricebahts)}`;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      paid: "✅",
      processing: "📦",
      shipped: "🚚",
      delivered: "🎉",
      cancelled: "❌",
      expired: "⏰",
      refunded: "💰"
    };
    return icons[status] || "📋";
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage your order history
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`
              px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
              ${filterStatus === status
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-2 text-xs">
                ({orders.filter(o => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Orders Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filterStatus === "all" 
              ? "You haven't placed any orders yet."
              : `You don't have any ${filterStatus} orders.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{getStatusIcon(order.status)}</div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(order.total_price_bahts)}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                {order.status !== "pending" && order.status !== "cancelled" && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4 overflow-x-auto">
                    <div className="flex items-center gap-1">
                      <span className={order.paid_at ? "text-green-600 dark:text-green-400" : ""}>
                        ✓ Paid
                      </span>
                      {order.paid_at && (
                        <span className="text-xs">({formatDate(order.paid_at)})</span>
                      )}
                    </div>
                    {order.shipped_at && (
                      <>
                        <span>→</span>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600 dark:text-blue-400">✓ Shipped</span>
                          <span className="text-xs">({formatDate(order.shipped_at)})</span>
                        </div>
                      </>
                    )}
                    {order.delivered_at && (
                      <>
                        <span>→</span>
                        <div className="flex items-center gap-1">
                          <span className="text-purple-600 dark:text-purple-400">✓ Delivered</span>
                          <span className="text-xs">({formatDate(order.delivered_at)})</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                  >
                    {expandedOrder === order.id ? "Hide Details" : "View Details"}
                  </button>

                  {/* {["pending", "paid"].includes(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-medium text-sm"
                    >
                      Cancel Order
                    </button>
                  )} */}
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => {
                      const imageUrl = item.product_image
                        ? `${API_BASE_URL}/${item.product_image}`
                        : "/placeholder.png";

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                              {item.product_name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatPrice(item.price_at_purchase_bahts)} each
                            </p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">
                              {formatPrice(item.price_at_purchase_bahts * item.quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(order.total_price_bahts)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;