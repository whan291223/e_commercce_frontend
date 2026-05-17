import React, { useState, useEffect } from "react";
import ProductApi from "../../api/ProductApi";
import CategoryApi from "../../api/CategoryApi";
import VariantApi from "../../api/VariantApi";

function AddProductModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = product info, 2 = variants
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [createdProduct, setCreatedProduct] = useState(null);

  const [productData, setProductData] = useState({
    name: "", description: "", category_id: "",
  });

  // Variants added during step 2
  const [variants, setVariants] = useState([]);
  const [variantForm, setVariantForm] = useState({
    option1_name: "", option1_value: "",
    option2_name: "", option2_value: "",
    price: "", stock: "",
  });
  const [variantLoading, setVariantLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    CategoryApi.fetchCategories().then(res => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setProductData(pd => ({ ...pd, category_id: res.data[0].id }));
      }
    });
  }, [isOpen]);

  // Reset everything on close
  const handleClose = () => {
    setStep(1);
    setCreatedProduct(null);
    setVariants([]);
    setProductData({ name: "", description: "", category_id: "" });
    setImageFile(null);
    setVariantForm({ option1_name: "", option1_value: "", option2_name: "", option2_value: "", price: "", stock: "" });
    onClose();
  };

  const handleFinish = () => {
    onSuccess();
    handleClose();
  };

  if (!isOpen) return null;

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("category_id", productData.category_id);
      if (imageFile) formData.append("image", imageFile);

      const res = await ProductApi.createProduct(formData);
      setCreatedProduct(res.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Failed to create product: " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = async () => {
    if (!variantForm.price || !variantForm.stock) {
      alert("Price and stock are required");
      return;
    }
    setVariantLoading(true);
    try {
      const res = await VariantApi.createVariant({
        product_id: createdProduct.id,
        option1_name: variantForm.option1_name || null,
        option1_value: variantForm.option1_value || null,
        option2_name: variantForm.option2_name || null,
        option2_value: variantForm.option2_value || null,
        price: parseFloat(variantForm.price),
        stock: parseInt(variantForm.stock),
      });
      setVariants(prev => [...prev, res.data]);
      // Reset form but keep option names for convenience
      setVariantForm(prev => ({
        ...prev, option1_value: "", option2_value: "", price: "", stock: "",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to add variant");
    } finally {
      setVariantLoading(false);
    }
  };

  const handleRemoveVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const inputCls = "w-full p-2.5 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelCls = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {step === 1 ? "Add New Product" : `Add Variants — ${createdProduct?.name}`}
            </h2>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${step === 1 ? "bg-blue-600 text-white" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`}>
                {step === 1 ? "Step 1" : "✓ Step 1"}
              </span>
              <span className="text-gray-300 dark:text-gray-600 text-xs">→</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
                Step 2
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">×</button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">

          {/* ── Step 1: Product Info ── */}
          {step === 1 && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Category</label>
                <select
                  name="category_id"
                  value={productData.category_id}
                  onChange={e => setProductData(p => ({ ...p, category_id: e.target.value }))}
                  required
                  className={inputCls}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Product Name</label>
                <input
                  value={productData.name}
                  onChange={e => setProductData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Classic T-Shirt"
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={productData.description}
                  onChange={e => setProductData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the product..."
                  required
                  className={`${inputCls} h-24 resize-none`}
                />
              </div>

              <div>
                <label className={labelCls}>Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="w-full text-sm text-gray-700 dark:text-gray-300"
                />
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleClose}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50">
                  {loading ? "Creating..." : "Next: Add Variants →"}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 2: Variants ── */}
          {step === 2 && (
            <div className="space-y-4">

              {/* Existing variants */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  {variants.map((v, i) => {
                    const label = [
                      v.option1_name && `${v.option1_name}: ${v.option1_value}`,
                      v.option2_name && `${v.option2_name}: ${v.option2_value}`,
                    ].filter(Boolean).join(" / ") || "No options";

                    return (
                      <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-gray-700 dark:text-gray-300">{label}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">฿{parseFloat(v.price).toFixed(2)}</span>
                          <span className="text-green-600 dark:text-green-400">{v.stock} in stock</span>
                        </div>
                        <button onClick={() => handleRemoveVariant(i)}
                          className="text-red-500 hover:text-red-600 text-xs ml-2">✕</button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add variant form */}
              <div className="rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-4 space-y-3">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {variants.length === 0 ? "Add your first variant" : "Add another variant"}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Option 1 Name</label>
                    <input value={variantForm.option1_name}
                      onChange={e => setVariantForm(p => ({ ...p, option1_name: e.target.value }))}
                      placeholder="e.g. Color" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Option 1 Value</label>
                    <input value={variantForm.option1_value}
                      onChange={e => setVariantForm(p => ({ ...p, option1_value: e.target.value }))}
                      placeholder="e.g. Red" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Option 2 Name</label>
                    <input value={variantForm.option2_name}
                      onChange={e => setVariantForm(p => ({ ...p, option2_name: e.target.value }))}
                      placeholder="e.g. Size" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Option 2 Value</label>
                    <input value={variantForm.option2_value}
                      onChange={e => setVariantForm(p => ({ ...p, option2_value: e.target.value }))}
                      placeholder="e.g. M" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Price (฿) *</label>
                    <input type="number" value={variantForm.price}
                      onChange={e => setVariantForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="0.00" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Stock *</label>
                    <input type="number" value={variantForm.stock}
                      onChange={e => setVariantForm(p => ({ ...p, stock: e.target.value }))}
                      placeholder="0" className={inputCls} />
                  </div>
                </div>

                <button onClick={handleAddVariant} disabled={variantLoading}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50">
                  {variantLoading ? "Adding..." : "+ Add Variant"}
                </button>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {variants.length === 0
                    ? "You can add variants later from the Edit modal."
                    : `${variants.length} variant${variants.length > 1 ? "s" : ""} added`}
                </p>
                <button
                  onClick={handleFinish}
                  className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  {variants.length === 0 ? "Finish Without Variants" : "Finish ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;