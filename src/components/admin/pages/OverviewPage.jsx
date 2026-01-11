import React, { useState, useEffect, useCallback } from "react";
import CategoryApi from "../../../api/CategoryApi";
import ProductApi from "../../../api/ProductApi";
import AddCategoryModal from "../AddCategoryModal";
import AddProductModal from "../AddProductModal";

function OverviewPage() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);

  const updateCounts = useCallback(async () => {
    try {
      const catRes = await CategoryApi.fetchCategories();
      const prodRes = await ProductApi.fetchProducts();
      setCategoryCount(catRes.data.length);
      setProductCount(prodRes.data.length);
    } catch (error) {
      console.error("Failed to update counts:", error);
    }
  }, []);

  useEffect(() => {
    updateCounts();
  }, [updateCounts]);

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
                0
              </p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Revenue
              </h2>
              <p className="text-3xl font-bold mt-2 text-orange-600 dark:text-orange-400">
                $0
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
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