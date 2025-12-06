// Customet page contain -> CategoryList and ProductGrid
import React from "react";
// import { fetchProducts, fetchProductsByCategory } from '../../api'
import ProductApi from "../../api/ProductApi";
import CategoryList from "./CategoryList"
import { useState } from "react";
import { useEffect } from "react";
import ProductGrid from "./ProductGrid";
function CustomerPage() {
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState('Our Star Product');

    // init fuction -> fetch the products
    useEffect( () => {
        const loadAllProducts = async () => { //why not use callback? what this use effect do ? why async?
            try {
                const response = await ProductApi.fetchProducts();
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        loadAllProducts();
    }, []);

    // function that will call in the return html
    const handleCategorySelect = async (category) => {
        if (!category) {
            // If all is select or component is mount???
            const response = await ProductApi.fetchProducts();
            setProducts(response.data);
            setTitle('Our Star Products');
        } else {
            try {
                const response = await ProductApi.fetchProductsByCategory(category.name); // is use by id or name which one is realworld
                setProducts(response.data);
                setTitle(`Products in ${category.name}`);
            } catch (error) {
                console.error("Failed to fetch prodcts by category: ", error);
                setProducts([]);
            }
        }
    };

    
    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* list of category button */}
            <CategoryList onCategorySelect={handleCategorySelect} />

            {/* Title of Category Name if not shown as can't see any product #TODO add 'Can't see any product!'*/}
            <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-800">
            {title}
            </h1>

            {/* Product List of that Category  #TODO need to have a picture for each item*/}
            <ProductGrid products={products} />
        </div>
);

}


export default CustomerPage;