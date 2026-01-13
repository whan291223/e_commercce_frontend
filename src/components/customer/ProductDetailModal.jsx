import React from "react";
import { useCart } from "../../context/CartContext";

const API_BASE_URL = "http://localhost:8000";

function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const imageUrl = product.image_path
    ? `${API_BASE_URL}/${product.image_path}`
    : "/placeholder.png";

  const handleAddToCart = () => {
    addToCart(product);
    onClose(); // Close modal after adding
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl font-bold z-10"
          >
            ×
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left: Image */}
            <div className="flex items-center justify-center">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-auto max-h-96 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <span className="inline-block w-fit px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full mb-4">
                {product.category?.name}
              </span>

              {/* Product Name */}
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {product.name}
              </h2>

              {/* Price */}
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                ${product.price?.toFixed(2)}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Product Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Product ID:</span>
                    <span className="text-gray-800 dark:text-gray-200">#{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="text-gray-800 dark:text-gray-200">{product.category?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Availability:</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">In Stock</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>🛒</span> Add to Cart
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailModal;