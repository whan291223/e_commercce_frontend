import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import ProductDetailModal from "./ProductDetailModal";

const API_BASE_URL = "http://localhost:8000";

function ProductGrid({ products }) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300 mt-10">
        No products found.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((product) => {
          const imageUrl = product.image_path
            ? `${API_BASE_URL}/${product.image_path}`
            : "/placeholder.png";

          return (
            <div
              key={product.id}
              className="
                bg-white dark:bg-gray-800
                shadow-md dark:shadow-none
                rounded-xl p-5
                border border-gray-200 dark:border-gray-700
                hover:shadow-lg dark:hover:shadow-gray-900/50
                transition-shadow duration-200
                flex flex-col justify-between
              "
            >
              <div className="flex flex-col h-full">
                {/* Product Image - Click to view details */}
                {product.image_path && (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedProduct(product)}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                )}

                {/* Product Name - Click to view details */}
                <h3
                  className="text-lg font-semibold text-gray-800 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2 grow">
                  {product.description}
                </p>

                {/* View Details Link */}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 text-left"
                >
                  View details →
                </button>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price?.toFixed(2)}
                  </p>
                  <span
                    className="
                      text-xs
                      bg-gray-100 dark:bg-gray-700
                      text-gray-700 dark:text-gray-200
                      px-3 py-1 rounded-full
                    "
                  >
                    {product.category?.name}
                  </span>
                </div>

                {/* Quick Add to Cart */}
                <button
                  onClick={() => addToCart(product)}
                  className="
                    mt-5 w-full bg-blue-600 hover:bg-blue-700 
                    text-white font-semibold py-2 px-4 rounded-lg 
                    transition-colors duration-200 flex items-center justify-center gap-2
                  "
                >
                  <span>🛒</span> Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

export default ProductGrid;