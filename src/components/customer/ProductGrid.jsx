import React, { useState } from "react";
import ProductDetailModal from "./ProductDetailModal";

function ProductGrid({ products }) {
  // Remove unused addToCart since we're now using the modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300 mt-10">
        No products found.
      </p>
    );
  }

  // Helper function to get price range from variants
  const getPriceDisplay = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return "N/A";
    }

    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `฿ ${minPrice.toFixed(2)}`;
    }
    return `฿ ${minPrice.toFixed(2)} - ฿ ${maxPrice.toFixed(2)}`;
  };

  // Helper function to check stock availability
  const hasStock = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return false;
    }
    return product.variants.some(v => v.stock > 0);
  };

  // Helper function to get total stock
  const getTotalStock = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((product) => {
          const imageUrl = product.image_path
            ? `/${product.image_path}`
            : "/placeholder.png";
          
          const inStock = hasStock(product);
          const totalStock = getTotalStock(product);

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
                relative
              "
            >
              {/* Out of Stock Badge */}
              {!inStock && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  Out of Stock
                </div>
              )}

              <div className="flex flex-col h-full">
                {/* Product Image - Click to view details */}
                {product.image_path && (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className={`w-full h-40 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity ${
                      !inStock ? "opacity-60" : ""
                    }`}
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

                {/* Variant info */}
                {product.variants && product.variants.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
                  </div>
                )}

                {/* View Details Link */}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 text-left"
                >
                  View details →
                </button>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {getPriceDisplay(product)}
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

                {/* Stock indicator */}
                {inStock && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    {totalStock} units in stock
                  </div>
                )}

                {/* Add to Cart - Opens modal to select variant */}
                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={!inStock}
                  className={`
                    mt-5 w-full font-semibold py-2 px-4 rounded-lg 
                    transition-colors duration-200 flex items-center justify-center gap-2
                    ${inStock 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span>🛒</span> {inStock ? 'Select Options' : 'Out of Stock'}
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