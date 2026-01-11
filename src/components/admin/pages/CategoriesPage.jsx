import React, { useState, useEffect } from "react";
import CategoryApi from "../../../api/CategoryApi";
import AddCategoryModal from "../AddCategoryModal";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await CategoryApi.fetchCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;

    try {
      await CategoryApi.deleteCategory(id);
      loadCategories();
    } catch (err) {
      alert("Failed to delete category");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Manage Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your products into categories
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow font-medium"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ID: {category.id}
                </p>
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-gray-600 dark:text-gray-400">
            No categories yet. Create one to get started!
          </p>
        </div>
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          loadCategories();
        }}
      />
    </div>
  );
}

export default CategoriesPage;