import React, { useState, useEffect } from "react";
import ProductApi from "../../../api/ProductApi";
import AdminProductTable from "../AdminProductTable";
import EditProductModal from "../EditProductModal";
import AddProductModal from "../AddProductModal";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const loadProducts = async () => {
    try {
      const prodRes = await ProductApi.fetchProducts();
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Manage Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View, edit, and manage your product catalog
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow font-medium"
        >
          + Add Product
        </button>
      </div>

      <AdminProductTable
        products={products}
        onRefresh={loadProducts}
        onEdit={setEditingProduct}
      />

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          loadProducts();
        }}
      />
    </div>
  );
}

export default ProductsPage;