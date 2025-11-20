import React from "react";

function ProductGrid({ products }) {
    // Always expect an array
    if (!Array.isArray(products) || products.length === 0) {
        return <p>No products found.</p>;
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                    <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-desc">{product.description}</p>
                        <p className="product-price">{product.price?.toFixed(2)}</p>
                        <span className="product-category">{product.category?.name}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductGrid;
