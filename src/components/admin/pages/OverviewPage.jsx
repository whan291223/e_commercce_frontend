import React, { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import CategoryApi from "../../../api/CategoryApi";
import ProductApi from "../../../api/ProductApi";
import OrderApi from "../../../api/OrderApi";
import AddCategoryModal from "../AddCategoryModal";
import AddProductModal from "../AddProductModal";

function OverviewPage() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [revenueView, setRevenueView] = useState("monthly"); // "monthly" or "yearly"
  const [revenueData, setRevenueData] = useState([]);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);

  const updateCounts = useCallback(async () => {
    try {
      const catRes = await CategoryApi.fetchCategories();
      const prodRes = await ProductApi.fetchProducts();
      setCategoryCount(catRes.data.length);
      setProductCount(prodRes.data.length);

      const orderRes = await OrderApi.fetchOrders();
      const orders = orderRes.data;
      setOrderCount(orders.length);
      
      const totalRevenue = orders
        .filter(o => o.status === "paid")
        .reduce((sum, o) => sum + o.total_price_bahts, 0);
      setRevenue(totalRevenue);

      // Process revenue data for chart
      processRevenueData(orders);
    } catch (error) {
      console.error("Failed to update counts:", error);
    }
  }, []);

  const processRevenueData = (orders) => {
    const paidOrders = orders.filter(o => o.status === "paid");
    
    if (revenueView === "monthly") {
      // Group by month for the last 12 months
      const monthlyData = {};
      const now = new Date();
      
      // Initialize last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = { month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), revenue: 0 };
      }
      
      // Aggregate order revenue by month
      paidOrders.forEach(order => {
        const orderDate = new Date(order.created_at || order.order_date);
        const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[key]) {
          monthlyData[key].revenue += order.total_price_bahts;
        }
      });
      
      setRevenueData(Object.values(monthlyData));
    } else {
      // Group by year
      const yearlyData = {};
      
      paidOrders.forEach(order => {
        const orderDate = new Date(order.created_at || order.order_date);
        const year = orderDate.getFullYear();
        if (!yearlyData[year]) {
          yearlyData[year] = { year: year.toString(), revenue: 0 };
        }
        yearlyData[year].revenue += order.total_price_bahts;
      });
      
      setRevenueData(Object.values(yearlyData).sort((a, b) => a.year - b.year));
    }
  };

  useEffect(() => {
    updateCounts();
  }, [updateCounts]);

  useEffect(() => {
    // Re-process revenue data when view changes
    const fetchAndProcess = async () => {
      try {
        const orderRes = await OrderApi.fetchOrders();
        processRevenueData(orderRes.data);
      } catch (error) {
        console.error("Failed to process revenue data:", error);
      }
    };
    fetchAndProcess();
  }, [revenueView]);

  const formatPrice = (pricebahts) => `฿${pricebahts.toFixed(2)}`;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to your admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Categories
              </h2>
              <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
                {categoryCount}
              </p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Products
              </h2>
              <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
                {productCount}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </h2>
              <p className="text-3xl font-bold mt-2 text-purple-600 dark:text-purple-400">
                {orderCount}
              </p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </h2>
              <p className="text-3xl font-bold mt-2 text-orange-600 dark:text-orange-400">
                {formatPrice(revenue)}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Revenue Overview
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setRevenueView("monthly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                revenueView === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setRevenueView("yearly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                revenueView === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey={revenueView === "monthly" ? "month" : "year"} 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `฿${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
              formatter={(value) => [`฿${value.toLocaleString()}`, 'Revenue']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Revenue (฿)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow font-medium"
          >
            + Add Category
          </button>
          <button
            onClick={() => setProductModalOpen(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow font-medium"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={updateCounts}
      />

      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSuccess={updateCounts}
      />
    </div>
  );
}

export default OverviewPage;