// ShopPage.jsx - Public shop page with products and categories
import React, { useState, useEffect } from "react";
import ProductApi from "../../api/ProductApi";
import CategoryList from "./CategoryList";
import ProductGrid from "./ProductGrid";

function ShopPage() {  // ✅ Renamed from CustomerPage
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState('Our Star Products');

    // Fetch all products on mount
    useEffect(() => {
        const loadAllProducts = async () => {
            try {
                const response = await ProductApi.fetchProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        loadAllProducts();
    }, []);

    // Handle category filtering
    const handleCategorySelect = async (category) => {
        if (!category) {
            // Show all products
            const response = await ProductApi.fetchProducts();
            setProducts(response.data);
            setTitle('Our Star Products');
        } else {
            try {
                const response = await ProductApi.fetchProductsByCategory(category.name);
                setProducts(response.data);
                setTitle(`Products in ${category.name}`);
            } catch (error) {
                console.error("Failed to fetch products by category:", error);
                setProducts([]);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Category filter buttons */}
            <CategoryList onCategorySelect={handleCategorySelect} />

            {/* Product section title */}
            <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-800 dark:text-white">
                {title}
            </h1>

            {/* Product grid */}
            <ProductGrid products={products} />
            
            {products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No products found in this category.
                    </p>
                </div>
            )}
        </div>
    );
}

export default ShopPage;  // ✅ Renamed from CustomerPage