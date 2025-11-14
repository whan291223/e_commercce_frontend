// TODO create admin dashboard

import React, {useState, useEffect, useCallback} from "react";
import {fetchCategories, fetchProducts} from '../../api/CategoryApi'
import AddCategoryModal from './AddCategoryModel'
import AddProductModal from "./AddProductModel";

function AdminDashboard() {
    const [categoryCount, setCategoryCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);

    const updateCounts = useCallback( async () => {
        try {
            const catRes = await fetchCategory();
            const prodRes = await fetchAllProduct();
            setCategoryCount(catRes.data.length);
            setProductCount(prodRes.data.length); // confuse why use.data.length

        } catch (error) {
            console.error("Failed to update counts:", error)
        }
    }, []);

    useEffect

}
