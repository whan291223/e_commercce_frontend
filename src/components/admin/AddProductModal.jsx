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
    // setProductData((prev) =>{ 
    //   console.log("prev pd:", prev); 
    //   return { ...prev, [name]: value };
    // });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // console.log({
      //   ...productData,
      //   category_id: parseInt(productData.category_id),
      //   price: parseInt(productData.price),
      // });
      await ProductApi.createProduct({
        ...productData,
        category_id: parseInt(productData.category_id),
        price: parseInt(productData.price),
      });
      alert("Product created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      // console.error("Failed to create product:", error);
      // alert("Failed to create product.");
      console.error("Server validation error:", error.response.data);
      alert("Validation failed: " + JSON.stringify(error.response.data));
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <select
            name="category_id"
            value={productData.category_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Name */}
          <input
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Description */}
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>

          {/* Price */}
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
