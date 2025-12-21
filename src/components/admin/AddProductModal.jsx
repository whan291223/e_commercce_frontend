import React, { useState, useEffect } from "react";
import ProductApi from "../../api/ProductApi";
import CategoryApi from "../../api/CategoryApi";

function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        const res = await CategoryApi.fetchCategories();
        setCategories(res.data);
        if (res.data.length > 0) {
          setProductData((pd) => ({ ...pd, category_id: res.data[0].id }));
        }
      };
      loadCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ProductApi.createProduct({
        ...productData,
        category_id: parseInt(productData.category_id),
        price: parseInt(productData.price),
      });
      alert("Product created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Server validation error:", error.response?.data);
      alert("Validation failed: " + JSON.stringify(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    /* BACKDROP */
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      
      {/* MODAL BOX */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        
        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CATEGORY */}
          <select
            name="category_id"
            value={productData.category_id}
            onChange={handleChange}
            required
            className="
              w-full p-3 rounded-lg border
              bg-white dark:bg-gray-900
              border-gray-300 dark:border-gray-600
              text-gray-800 dark:text-gray-100
              focus:outline-none focus:ring-2
              focus:ring-blue-500 dark:focus:ring-blue-400
            "
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* NAME */}
          <input
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="
              w-full p-3 rounded-lg border
              bg-white dark:bg-gray-900
              border-gray-300 dark:border-gray-600
              text-gray-800 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2
              focus:ring-blue-500 dark:focus:ring-blue-400
            "
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="
              w-full p-3 h-24 rounded-lg border resize-none
              bg-white dark:bg-gray-900
              border-gray-300 dark:border-gray-600
              text-gray-800 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2
              focus:ring-blue-500 dark:focus:ring-blue-400
            "
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="
              w-full p-3 rounded-lg border
              bg-white dark:bg-gray-900
              border-gray-300 dark:border-gray-600
              text-gray-800 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2
              focus:ring-blue-500 dark:focus:ring-blue-400
            "
          />

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-lg
                bg-gray-200 dark:bg-gray-700
                text-gray-800 dark:text-gray-200
                hover:bg-gray-300 dark:hover:bg-gray-600
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-4 py-2 rounded-lg
                bg-blue-600 hover:bg-blue-700
                dark:bg-blue-500 dark:hover:bg-blue-600
                text-white transition shadow
                disabled:opacity-50
              "
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
