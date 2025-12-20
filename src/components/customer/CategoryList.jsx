import React, { useState, useEffect } from 'react';
import CategoryApi from "../../api/CategoryApi.jsx";

function CategoryList({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleButtonSelected = (cat) => {
    setSelectedCategory(cat); 
    onCategorySelect(cat);
    console.log(cat)
  }
// TODO still not done with blude highlighted category selected button 
  return (
    <div className="flex gap-2 flex-wrap bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-sm">
      <button
        className={"px-4 py-2 rounded-lg transition " + 
          ( selectedCategory === null
            ? "bg-blue-500 text-white hover:bg-blue-600"
            :  "bg-white text-gray-700 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-800")} // this hover blue need to be edit so that it highlight button that selected
            //  dark:bg-gray-800 dark:text-white
        onClick={() => handleButtonSelected(null)}
      >
        All Products
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className={"px-4 py-2 rounded-lg transition " + 
          ( selectedCategory === cat
            ? "bg-blue-500 text-white hover:bg-blue-600"
            :  "bg-white text-gray-700 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 hover:dark:bg-gray-800")} // this hover blue need to be edit so that it highlight button that selected
          onClick={() => handleButtonSelected(cat)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryList;
