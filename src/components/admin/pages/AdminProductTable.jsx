import React, { useState } from "react";
import ProductApi from "../../../api/ProductApi";

function AdminProductTable({ products, onRefresh, onEdit }) {
  const [sortBy, setSortBy] = useState("name_asc");
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await ProductApi.deleteProduct(productId);
      onRefresh();
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  const getActiveVariants = (product) =>
    product.variants?.filter(v => v.is_active) || [];

  const getProductPrice = (product) => {
    const active = getActiveVariants(product);
    if (active.length === 0) return 0;
    return Math.min(...active.map(v => v.price));
  };

  const getPriceDisplay = (product) => {
    const active = getActiveVariants(product);
    if (active.length === 0) return "N/A";
    const prices = active.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `฿ ${min.toFixed(2)}` : `฿ ${min.toFixed(2)} – ฿ ${max.toFixed(2)}`;
  };

  const getTotalStock = (product) =>
    getActiveVariants(product).reduce((sum, v) => sum + v.stock, 0);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name_asc":      return a.name.localeCompare(b.name);
      case "name_desc":     return b.name.localeCompare(a.name);
      case "price_asc":     return getProductPrice(a) - getProductPrice(b);
      case "price_desc":    return getProductPrice(b) - getProductPrice(a);
      case "category_asc":  return (a.category?.name || "").localeCompare(b.category?.name || "");
      case "category_desc": return (b.category?.name || "").localeCompare(a.category?.name || "");
      case "stock_asc":     return getTotalStock(a) - getTotalStock(b);
      case "stock_desc":    return getTotalStock(b) - getTotalStock(a);
      default:              return 0;
    }
  });

  return (
    <div className="mt-6">
      {/* Sort */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        >
          <option value="name_asc">Name (A–Z)</option>
          <option value="name_desc">Name (Z–A)</option>
          <option value="price_asc">Price (Low to High)</option>
          <option value="price_desc">Price (High to Low)</option>
          <option value="category_asc">Category (A–Z)</option>
          <option value="category_desc">Category (Z–A)</option>
          <option value="stock_asc">Stock (Low to High)</option>
          <option value="stock_desc">Stock (High to Low)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-300 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 w-8" />
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Price Range</th>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Active Variants</th>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Total Stock</th>
              <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Category</th>
              <th className="px-4 py-3 text-center text-sm dark:text-white font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedProducts.map(product => {
              const activeVariants = getActiveVariants(product);
              const allVariants = product.variants || [];
              const activeCount = activeVariants.length;
              const inactiveCount = allVariants.length - activeCount;
              const totalStock = getTotalStock(product);
              const isExpanded = expandedIds.has(product.id);

              return (
                <React.Fragment key={product.id}>
                  {/* Product row */}
                  <tr className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {/* Expand toggle */}
                    <td className="px-4 py-3 text-center">
                      {allVariants.length > 0 && (
                        <button
                          onClick={() => toggleExpand(product.id)}
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-transform duration-200"
                          style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}
                        >
                          ▶
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3 font-medium dark:text-white">{product.name}</td>

                    <td className="px-4 py-3 dark:text-white">{getPriceDisplay(product)}</td>

                    <td className="px-4 py-3">
                      {activeCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                            {activeCount} active
                          </span>
                          {inactiveCount > 0 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                              {inactiveCount} inactive
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">No active variants</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`font-semibold ${totalStock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {totalStock}
                      </span>
                    </td>

                    <td className="px-4 py-3 dark:text-white">{product.category?.name || "–"}</td>

                    <td className="px-4 py-3 text-center space-x-2">
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

                  {/* Expanded variant rows */}
                  {isExpanded && allVariants.map(variant => {
                    const optionLabel = [
                      variant.option1_name && `${variant.option1_name}: ${variant.option1_value}`,
                      variant.option2_name && `${variant.option2_name}: ${variant.option2_value}`,
                    ].filter(Boolean).join("  /  ");

                    return (
                      <tr
                        key={`variant-${variant.id}`}
                        className={`border-t border-gray-200 dark:border-gray-700 ${
                          variant.is_active
                            ? "bg-gray-50/70 dark:bg-gray-900/30"
                            : "bg-gray-100 dark:bg-gray-900/10 opacity-50"
                        }`}
                      >
                        <td className="px-4 py-2" />
                        {/* Indent + variant label */}
                        <td className="px-4 py-2" colSpan={2}>
                          <div className="flex items-center gap-2 pl-4 border-l-2 border-blue-300 dark:border-blue-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                              {optionLabel || "No options"}
                            </span>
                            {!variant.is_active && (
                              <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded">
                                inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm dark:text-white">
                          ฿ {parseFloat(variant.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`text-sm font-medium ${variant.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                            {variant.stock}
                          </span>
                        </td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => onEdit(product)}
                            className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Edit in Modal
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminProductTable;