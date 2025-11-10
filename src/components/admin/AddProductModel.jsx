import React, { useState, useEffect} from "react";
import createProduct from "../../api/ProductApi";
import fetchCategory from "../../api/CategoryApi";

function AddProductModal( { isOpen, onClose, onSuccess }) {
    const [categories, setCategories] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
    });

    useEffect(() => {
        if (isOpen) {
            const loadCategories = async () => {
                const res = await fetchCategory();
                setCategories(res.data);

                if ( res.data.length > 0) {
                    setProductData( pd => ({ ...pd, category_id: res.data[0].id}))
                }
            };
        }
    })

}


