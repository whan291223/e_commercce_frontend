import React, { useState } from "react";
import CategoryApi from "../../api/CategoryApi";

function AddCategoryModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CategoryApi.createCategory(name);
      alert("Category created successfully!");
      setName("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create Category", error);
      alert("Failed to create category");
    }
  };

  return (
    /* BACKDROP */
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      
      {/* MODAL BOX */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        
        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Add New Category
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* INPUT */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="
              w-full px-4 py-3 rounded-lg border
              bg-white dark:bg-gray-900
              border-gray-300 dark:border-gray-600
              text-gray-800 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2
              focus:ring-blue-500 dark:focus:ring-blue-400
            "
            required
          />

          {/* BUTTONS */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-5 py-2 rounded-lg
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
              className="
                px-5 py-2 rounded-lg
                bg-blue-600 hover:bg-blue-700
                dark:bg-blue-500 dark:hover:bg-blue-600
                text-white transition shadow
              "
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryModal;
