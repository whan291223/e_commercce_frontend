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
      // Filter out pending/expired orders - users only see paid orders
      const confirmedOrders = res.data.filter(order => 
        !["pending", "expired"].includes(order.status)
      );
      setOrders(confirmedOrders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      if (err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (pricebahts) => `฿${pricebahts.toLocaleString()}`;
  
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

  // ✅ CLEARER STATUS LABELS FOR CUSTOMERS
  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    };

    const labels = {
      paid: "PAYMENT RECEIVED",           // Clear: You paid, we got it
      processing: "PREPARING YOUR ORDER",  // Clear: We're packing it
      shipped: "SHIPPED",                  // Clear: It's on the way
      delivered: "DELIVERED",              // Clear: You got it
      cancelled: "CANCELLED",
      refunded: "REFUNDED"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.paid}`}>
        {labels[status] || status.toUpperCase()}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      paid: "💳",        // Money/payment icon
      processing: "📦",  // Package being prepared
      shipped: "🚚",     // Truck delivering
      delivered: "✅",   // Checkmark - completed
      cancelled: "❌",
      refunded: "💰"
    };
    return icons[status] || "📋";
  };

  // ✅ CLEARER MESSAGES
  const getStatusMessage = (order) => {
    switch (order.status) {
      case "paid":
        return "✅ Payment received! We'll start preparing your order soon.";
      case "processing":
        return "📦 We're packing your items right now. Hang tight!";
      case "shipped":
        return order.shipped_at 
          ? `🚚 Shipped on ${formatDate(order.shipped_at)}. On its way to you!`
          : "🚚 Your order is on its way!";
      case "delivered":
        return order.delivered_at
          ? `🎉 Delivered on ${formatDate(order.delivered_at)}. Enjoy!`
          : "🎉 Your order has been delivered!";
      case "cancelled":
        return "❌ This order was cancelled.";
      case "refunded":
        return "💰 This order has been refunded to your account.";
      default:
        return "Order status updated.";
    }
  };

  // ✅ CLEARER FILTER LABELS
  const customerStatuses = [
    { value: "all", label: "All Orders" },
    { value: "paid", label: "Paid" },           // Show "paid" orders waiting to be prepared
    { value: "processing", label: "Preparing" }, // Orders being packed
    { value: "shipped", label: "Shipped" },      // On the way
    { value: "delivered", label: "Delivered" }   // Completed
  ];
  
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
          Track your purchases and delivery status
        </p>
      </div>

      {/* ✅ CLEARER FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {customerStatuses.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={`
              px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
              ${filterStatus === value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {label}
            {value !== "all" && (
              <span className="ml-2 text-xs">
                ({orders.filter(o => o.status === value).length})
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
              ? "You haven't placed any orders yet. Start shopping!"
              : `You don't have any ${customerStatuses.find(s => s.value === filterStatus)?.label.toLowerCase()} orders.`
            }
          </p>
          <button
            onClick={() => window.location.href = "/shop"}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            Browse Products
          </button>
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
                        Ordered on {formatDate(order.created_at)}
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

                {/* Status Message */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {getStatusMessage(order)}
                  </p>
                </div>

                {/* ✅ CLEARER PROGRESS BAR */}
                {!["cancelled", "refunded"].includes(order.status) && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className={order.paid_at ? "text-yellow-600 dark:text-yellow-400 font-semibold" : "text-gray-400"}>
                        💳 Paid
                      </span>
                      <span className={order.status === "processing" || order.shipped_at ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-400"}>
                        📦 Preparing
                      </span>
                      <span className={order.shipped_at ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-400"}>
                        🚚 Shipped
                      </span>
                      <span className={order.delivered_at ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-400"}>
                        ✅ Delivered
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-yellow-500 via-indigo-500 to-green-500 transition-all duration-500"
                        style={{
                          width: 
                            order.delivered_at ? "100%" :
                            order.shipped_at ? "75%" :
                            order.status === "processing" ? "50%" :
                            "25%"
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                  >
                    {expandedOrder === order.id ? "Hide Items" : "View Items"}
                  </button>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Items in this order
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
                              Qty: {item.quantity} × {formatPrice(item.price_at_purchase_bahts)}
                            </p>
                          </div>
                          <div className="text-right">
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
                        Total Amount
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

// ## ✅ Clear Status Explanation:

// | Backend Status | Customer Sees | What It Means |
// |---------------|---------------|---------------|
// | `pending` | *(hidden)* | Not paid yet - don't show this |
// | `paid` | **PAYMENT RECEIVED** 💳 | You paid, we received it, waiting to pack |
// | `processing` | **PREPARING YOUR ORDER** 📦 | We're packing your items |
// | `shipped` | **SHIPPED** 🚚 | Package is on the way to you |
// | `delivered` | **DELIVERED** ✅ | You got it! |

// ## Progress Bar:
// ```
// 💳 Paid → 📦 Preparing → 🚚 Shipped → ✅ Delivered
//   25%       50%           75%         100%
  