import React, { useState } from "react";
import ProductApi from "../../../api/ProductApi";

function AdminProductTable({ products, onRefresh, onEdit }) {
  const [sortBy, setSortBy] = useState("name_asc");

  const handleDelete = async (productId) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await ProductApi.deleteProduct(productId);
      onRefresh();
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "category_asc":
        return (a.category?.name || "").localeCompare(b.category?.name || "");
      case "category_desc":
        return (b.category?.name || "").localeCompare(a.category?.name || "");
      default:
        return 0;
    }
  });

  return (
    <div className="mt-6">
      {/* Sort Controls */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="category_asc">Category (A-Z)</option>
          <option value="category_desc">Category (Z-A)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-300 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">
                Category
              </th>
              <th className="px-4 py-3 text-center text-sm dark:text-white font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-3 dark:text-white">{product.name}</td>
                <td className="px-4 py-3 dark:text-white">
                  ฿ {product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 dark:text-white">
                  {product.category?.name || "-"}
                </td>

                <td className="px-4 py-3 text-center space-x-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminProductTable;