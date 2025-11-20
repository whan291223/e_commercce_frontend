// TODO 1:38
import React from "react";
// import { fetchProducts, fetchProductsByCategory } from '../../api'
import ProductApi from "../../api/ProductApi";
import CategoryList from "./ProductGrid"
import { useState } from "react";
import { useEffect } from "react";
import ProductGrid
 from "./ProductGrid";
function CustomerPage() {
    const [products, setProduct] = useState([]);
    const [title, setTitle] = useState('Our Star Product');

    useEffect( () => {
        const loadAllProducts = async () => { //why not use callback? what this use effect do ? why async?
            try {
                const response = await ProductApi.fetchProducts();
                setProduct(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        loadAllProducts();
    }, []);

    const handleCategorySelect = async (category) => {
        if (!category) {
            // If all is select or component is mount???
            const response = await ProductApi.fetchProducts();
            setProduct(response.data);
            setTitle('Our Star Products');
        } else {
            try {
                const response = await ProductApi.fetchProductsByCategory(category.name); // is use by id or name which one is realworld
                setProducts(response.data);
                setTitle(`Products in ${category.name}`);
            } catch (error) {
                console.error("Failed to fetch prodcts by category: ", error);
                setProduct([]);
            }
        }
    };

    
    return (
        <div>
            <CategoryList onCategorySelect={handleCategorySelect}></CategoryList>
            <h1 className="page-title">{title}</h1>
            <ProductGrid products={products}></ProductGrid>
        </div>
    );
}


export default CustomerPage;