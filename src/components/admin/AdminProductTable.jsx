import React from "react";
import ProductApi from "../../api/ProductApi";

function AdminProductTable({ products, onRefresh, onEdit }) {
  const handleDelete = async (productId) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await ProductApi.deleteProduct(productId);
      onRefresh(); // reload product list
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  return (
    <div className="overflow-x-auto mt-6 ">
      <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-300 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Price</th>
            <th className="px-4 py-3 text-left text-sm dark:text-white font-semibold">Category</th>
            <th className="px-4 py-3 text-center text-sm dark:text-white font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t border-gray-300 dark:border-gray-600"
            >
              <td className="px-4 py-3 dark:text-white">{product.name}</td>
              <td className="px-4 py-3 dark:text-white">${product.price.toFixed(2)}</td>
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
        <p className="text-center text-gray-500 mt-4">
          No products found.
        </p>
      )}
    </div>
  );
}

export default AdminProductTable;
