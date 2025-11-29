import React from "react";

function ProductGrid({ products }) {
    if (!Array.isArray(products) || products.length === 0) {
        return <p className="text-center text-gray-500 mt-10">No products found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                    <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {product.name}
                        </h3>

                        <p className="text-gray-600 text-sm mt-2">
                            {product.description}
                        </p>

                        <p className="text-xl font-bold text-blue-600 mt-4">
                            ${product.price?.toFixed(2)}
                        </p>

                        <span className="mt-3 inline-block text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full w-max">
                            {product.category?.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductGrid;
