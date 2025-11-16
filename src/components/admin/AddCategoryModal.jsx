import React, { useState } from "react";
import CategoryApi from "../../api/CategoryApi";

function AddCategoryModal({ isOpen, onClose, onSuccess }) {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CategoryApi.createCategory(name);
            alert('Category created successfully!');
            setName('');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create Category', error);
            alert('Failed to create category');
        }
    };

    return (
        // BACKDROP
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">

            {/* MODAL BOX */}
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

                {/* TITLE */}
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
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
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* BUTTONS */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow"
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
