// TODO 44.07

import React, { useState} from "react";

function AddCategoryModel( { isOpen, onClose, onSuccess }) {
    const [name, setName] = useState('');
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // await createCategory(name);
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
        <div className="modal-backdrop"></div>
        // <div className="modal-content"></div>
    )
        
    


}
