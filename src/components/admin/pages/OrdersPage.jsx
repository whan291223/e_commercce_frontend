import React from "react";

function OrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Order Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track and manage customer orders
        </p>
      </div>

      {/* You can paste the AdminOrderTable component here later */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Order Table Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This is where your order management table will go
        </p>
      </div>
    </div>
  );
}

export default OrdersPage;