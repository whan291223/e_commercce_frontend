import React, { useState, useEffect } from 'react';
import CategoryApi from "../../api/CategoryApi.jsx";

function CategoryList({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CategoryApi.fetchCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="flex gap-2 flex-wrap bg-gray-100 p-4 rounded-lg shadow-sm">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={() => onCategorySelect(null)}
      >
        All Products
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-300 
                     rounded-lg hover:bg-gray-200 transition"
          onClick={() => onCategorySelect(cat)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryList;
