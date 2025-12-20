import React from "react";

function ProductGrid({ products }) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300 mt-10">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="
            bg-white dark:bg-gray-800
            shadow-md dark:shadow-none
            rounded-xl p-5
            border border-gray-200 dark:border-gray-700
            hover:shadow-lg dark:hover:shadow-gray-900/50
            transition-shadow duration-200
          "
        >
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {product.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              {product.description}
            </p>

            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-4">
              ${product.price?.toFixed(2)}
            </p>

            <span
              className="
                mt-3 inline-block text-xs
                bg-gray-100 dark:bg-gray-700
                text-gray-700 dark:text-gray-200
                px-3 py-1 rounded-full w-max
              "
            >
              {product.category?.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
