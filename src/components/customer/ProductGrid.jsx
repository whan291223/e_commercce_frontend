import React from "react";

function ProductGrid({ products }) {
    if (!products.length) {
        return <p>No products found.</p>
    }

    return (
        <div className="product-grid">
            {products.map((products) => (
                <div key={products.id} className="product-card">
                    <div className="product-info">
                        <h3>{products.name}</h3>
                        <p className="product-desc">{products.description} </p>
                        <p className="product-price">{products.price.toFixed(2)} </p>
                        <span className="product-category">{products.category.name}</span>

                    </div>
                </div>
            )

            )}

        </div>
    )
}