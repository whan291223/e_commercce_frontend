import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

const API_BASE_URL = "http://localhost:8000";

function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useCart();
  
  // Move all useState hooks BEFORE the early return
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Initialize color and size selections
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) return;

    const availableColors = [...new Set(
      product.variants.map(v => v.color).filter(Boolean)
    )];
    const availableSizes = [...new Set(
      product.variants.map(v => v.size).filter(Boolean)
    )];

    setSelectedColor(availableColors[0] || null);
    setSelectedSize(availableSizes[0] || null);
  }, [product]);

  // Find the matching variant
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    const variant = product.variants.find(v => {
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return colorMatch && sizeMatch;
    });

    setSelectedVariant(variant || product.variants[0]);
  }, [selectedColor, selectedSize, product]);

  // NOW we can do the early return check
  if (!product) return null;

  const imageUrl = product.image_path
    ? `${API_BASE_URL}/${product.image_path}`
    : "/placeholder.png";

  // Get unique colors and sizes from variants
  const availableColors = [...new Set(
    product.variants?.map(v => v.color).filter(Boolean) || []
  )];
  const availableSizes = [...new Set(
    product.variants?.map(v => v.size).filter(Boolean) || []
  )];

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a variant");
      return;
    }

    if (selectedVariant.stock < quantity) {
      alert("Not enough stock available");
      return;
    }

    // Add variant info to cart
    addToCart({
      ...product,
      selectedVariant,
      variantId: selectedVariant.id,
      price: selectedVariant.price,
      quantity
    });
    
    onClose();
  };

  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
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
                ฿ {selectedVariant?.price?.toFixed(2) || "N/A"}
              </div>

              {/* Variant Selection */}
              {hasVariants && (
                <div className="space-y-4 mb-6">
                  {/* Color Selection */}
                  {availableColors.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Color
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {availableColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedColor === color
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {availableSizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Size
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {availableSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${
                              selectedSize === size
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Info */}
                  {selectedVariant && (
                    <div className="text-sm">
                      <span className={`font-semibold ${
                        selectedVariant.stock > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedVariant.stock > 0 
                          ? `${selectedVariant.stock} units in stock` 
                          : 'Out of stock'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              {inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

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
                  {selectedVariant && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Variant ID:</span>
                      <span className="text-gray-800 dark:text-gray-200">#{selectedVariant.id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || !hasVariants}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    inStock && hasVariants
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>🛒</span> {!hasVariants ? 'No Variants Available' : !inStock ? 'Out of Stock' : 'Add to Cart'}
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