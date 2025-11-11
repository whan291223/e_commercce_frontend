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
                console.log(res)
                console.log(res.data)
                if ( res.data.length > 0) {
                    setProductData( pd => ({ ...pd, category_id: res.data[0].id}))
                }
            };
            loadCategories();
        }
    }, [isOpen]) // made change when is open is changed

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct({
                ...productData,
                price: parseFloat(productData.price)
            });
            alert('Product created successfully!')
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to created product:', error);
            alert('Failed to creaetd product.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Add new Product</h2>
                <form onSubmit={handleSubmit}>
                    <select name="category_id" value={productData.category_id} onChange={handleChange} required>
                        <option value="" disabled>Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select> 
                    <input name="name" value={productData.name} onChange={handleChange} placeholder="Product Name" required/>
                    <textarea name="description" value={productData.description} onChange={handleChange} placeholder="Description" required></textarea>
                    <input type="number" name="price" value={productData.price} onChange={handleChange} placeholder="Price" required/>
                    <div className="modal-actions">
                        <button type="submit">Create Product</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


