// TODO 44.07

import React, { useState } from "react";
import createCategory from "../../api/CategoryApi";

function AddCategoryModel({ isOpen, onClose, onSuccess }) {
    const [name, setName] = useState('');
    if (!isOpen) return null; //if it already open don't do anything

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory(name);
            alert('Category created succesfully!')
            setName('');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create Category', error);
            alert('Failed to create category')

        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Add New Category</h2>
                <form onSubmit={handleSubmit}></form>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category Name"
                    required
                />
                <div className="modal-action">
                    <button type="submit">Create</button>
                    <button type="button" onClick={onclose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddCategoryModel;