// TODO 1:38
import React from "react";
// import { fetchProducts, fetchProductsByCategory } from '../../api'
import ProductApi from "../../api/ProductApi";
import CategoryList from "./ProductGrid"
import { useState } from "react";
import { useEffect } from "react";

function CustomerPage() {
    const [product, setProduct] = useState([]);
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
                const response = await ProductApi.fetchProductsByCategory(category_id); // is use by id or name which one is realworld
                setProducts(response.data);
                setTitle(`Products in ${Category_name}`);
            } catch (error) {
                console.error("Failed to fetch prodcts by category: ", error);
                setProduct([]);
            }
        }
    };

    return { //TODO

    }


}
