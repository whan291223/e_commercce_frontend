import React, { useState, useEffect, useCallback } from "react";
import CategoryApi from '../../api/CategoryApi';
import ProductApi from "../../api/ProductApi";
import AddCategoryModal from './AddCategoryModal';
import AddProductModal from "./AddProductModal";

function AdminDashboard() {
    const [categoryCount, setCategoryCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);

    const updateCounts = useCallback(async () => {
        try {
            const catRes = await CategoryApi.fetchCategories();
            const prodRes = await ProductApi.fetchProducts();
            setCategoryCount(catRes.data.length);
            setProductCount(prodRes.data.length);
        } catch (error) {
            console.error("Failed to update counts:", error);
        }
    }, []);

    useEffect(() => {
        updateCounts();
    }, [updateCounts]);

    return (
        <div className="p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Total Categories</h2>
                    <p className="text-4xl font-bold mt-2 text-blue-600">{categoryCount}</p>
                </div>
                {/* Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Total Products</h2>
                    <p className="text-4xl font-bold mt-2 text-green-600">{productCount}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => setCategoryModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
                >
                    Add Category
                </button>

                <button
                    onClick={() => setProductModalOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow"
                >
                    Add Product
                </button>
            </div>

            {/* Modals */}
            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onSuccess={updateCounts}
            />

            <AddProductModal
                isOpen={isProductModalOpen}
                onClose={() => setProductModalOpen(false)}
                onSuccess={updateCounts}
            />
        </div>
    );
}

export default AdminDashboard;
