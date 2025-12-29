import React, { useEffect, useState } from "react";
import ProductApi from "../../api/ProductApi";
import CategoryApi from "../../api/CategoryApi";

function EditProductModal({ product, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
  });

  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category?.id ?? "",
    });
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;

    const loadCategories = async () => {
      const res = await CategoryApi.fetchCategories();
      setCategories(res.data);
    };
    loadCategories();
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category_id", formData.category_id);

      // ✅ only append image if user selected one
      if (imageFile) {
        data.append("image", imageFile);
      }

      await ProductApi.updateProduct(product.id, data);

      alert("Product updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CATEGORY */}
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* NAME */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 h-24 rounded-lg border resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
          />

          {/* IMAGE (optional) */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm text-gray-700 dark:text-gray-300"
          />

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Leave empty to keep existing image
          </p>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
