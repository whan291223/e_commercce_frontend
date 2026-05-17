import React, { useEffect, useState } from "react";
import ProductApi from "../../api/ProductApi";
import CategoryApi from "../../api/CategoryApi";
import VariantApi from "../../api/VariantApi";

function EditProductModal({ product, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("product"); // "product" | "variants"

  // Variant state
  const [variants, setVariants] = useState([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null); // variant being edited inline
  const [addingVariant, setAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState({
    option1_name: "", option1_value: "",
    option2_name: "", option2_value: "",
    price: "", stock: "",
  });

  const [formData, setFormData] = useState({
    name: "", description: "", category_id: "",
  });

  useEffect(() => {
    if (!product) return;
    setFormData({
      name: product.name,
      description: product.description,
      category_id: product.category?.id ?? "",
    });
    setVariants(product.variants || []);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    CategoryApi.fetchCategories().then(res => setCategories(res.data));
  }, [product]);

  if (!product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("id", product.id);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category_id", formData.category_id);
      if (imageFile) data.append("image", imageFile);
      await ProductApi.UpdateProduct(data);
      alert("Product updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // ── Variant handlers ──────────────────────────────────────

  const handleVariantEditChange = (e) => {
    const { name, value } = e.target;
    setEditingVariant(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantSave = async (variantId) => {
    setVariantLoading(true);
    try {
      await VariantApi.updateVariant({
        id: variantId,
        option1_name: editingVariant.option1_name || null,
        option1_value: editingVariant.option1_value || null,
        option2_name: editingVariant.option2_name || null,
        option2_value: editingVariant.option2_value || null,
        price: parseFloat(editingVariant.price),
        stock: parseInt(editingVariant.stock),
      });
      setVariants(prev =>
        prev.map(v => v.id === variantId ? { ...v, ...editingVariant } : v)
      );
      setEditingVariant(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update variant");
    } finally {
      setVariantLoading(false);
    }
  };

  const handleVariantDelete = async (variantId) => {
    if (!window.confirm("Delete this variant?")) return;
    setVariantLoading(true);
    try {
      await VariantApi.deleteVariant(variantId);
      setVariants(prev => prev.map(v =>
        v.id === variantId ? { ...v, is_active: false } : v
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to delete variant");
    } finally {
      setVariantLoading(false);
    }
  };

  const handleVariantRestore = async (variantId) => {
    setVariantLoading(true);
    try {
      await VariantApi.updateVariant({ id: variantId, is_active: true });
      setVariants(prev => prev.map(v =>
        v.id === variantId ? { ...v, is_active: true } : v
      ));
    } catch (err) {
      console.error(err);
      alert("Failed to restore variant");
    } finally {
      setVariantLoading(false);
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.price || !newVariant.stock) {
      alert("Price and stock are required");
      return;
    }
    setVariantLoading(true);
    try {
      const res = await VariantApi.createVariant({
        product_id: product.id,
        option1_name: newVariant.option1_name || null,
        option1_value: newVariant.option1_value || null,
        option2_name: newVariant.option2_name || null,
        option2_value: newVariant.option2_value || null,
        price: parseFloat(newVariant.price),
        stock: parseInt(newVariant.stock),
      });
      setVariants(prev => [...prev, res.data]);
      setNewVariant({
        option1_name: "", option1_value: "",
        option2_name: "", option2_value: "",
        price: "", stock: "",
      });
      setAddingVariant(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add variant");
    } finally {
      setVariantLoading(false);
    }
  };

  const inputCls = "w-full p-2 rounded-lg border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 text-sm";
  const labelCls = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Edit: {product.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {["product", "variants"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {tab === "variants"
                ? `Variants (${variants.filter(v => v.is_active).length} active)`
                : "Product Info"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* ── Product Tab ── */}
          {activeTab === "product" && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className={inputCls}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className={`${inputCls} h-24 resize-none`}
                />
              </div>

              <div>
                <label className={labelCls}>Image (leave empty to keep existing)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="w-full text-sm text-gray-700 dark:text-gray-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* ── Variants Tab ── */}
          {activeTab === "variants" && (
            <div className="space-y-3">

              {variants.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No variants yet.
                </p>
              )}

              {variants.map(variant => (
                <div
                  key={variant.id}
                  className={`rounded-lg border p-4 ${
                    variant.is_active
                      ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
                      : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/20 opacity-60"
                  }`}
                >
                  {editingVariant?.id === variant.id ? (
                    // ── Inline edit form ──
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Option 1 Name</label>
                          <input name="option1_name" value={editingVariant.option1_name || ""} onChange={handleVariantEditChange} placeholder="e.g. Color" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Option 1 Value</label>
                          <input name="option1_value" value={editingVariant.option1_value || ""} onChange={handleVariantEditChange} placeholder="e.g. Red" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Option 2 Name</label>
                          <input name="option2_name" value={editingVariant.option2_name || ""} onChange={handleVariantEditChange} placeholder="e.g. Size" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Option 2 Value</label>
                          <input name="option2_value" value={editingVariant.option2_value || ""} onChange={handleVariantEditChange} placeholder="e.g. M" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Price (฿)</label>
                          <input type="number" name="price" value={editingVariant.price} onChange={handleVariantEditChange} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Stock</label>
                          <input type="number" name="stock" value={editingVariant.stock} onChange={handleVariantEditChange} className={inputCls} />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingVariant(null)}
                          className="px-3 py-1.5 text-sm rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
                          Cancel
                        </button>
                        <button onClick={() => handleVariantSave(variant.id)} disabled={variantLoading}
                          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                          {variantLoading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ── Display row ──
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2 text-sm">
                        {/* Option badges */}
                        {variant.option1_name && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                            {variant.option1_name}: {variant.option1_value}
                          </span>
                        )}
                        {variant.option2_name && (
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs font-medium">
                            {variant.option2_name}: {variant.option2_value}
                          </span>
                        )}
                        {!variant.option1_name && !variant.option2_name && (
                          <span className="text-gray-400 dark:text-gray-500 text-xs italic">No options</span>
                        )}
                        <span className="text-gray-700 dark:text-gray-300 font-medium">฿{parseFloat(variant.price).toFixed(2)}</span>
                        <span className={`text-xs ${variant.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                          {variant.stock} in stock
                        </span>
                        {!variant.is_active && (
                          <span className="text-xs text-gray-400 italic">inactive</span>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {variant.is_active ? (
                          <>
                            <button
                              onClick={() => setEditingVariant({ ...variant })}
                              className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleVariantDelete(variant.id)}
                              disabled={variantLoading}
                              className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleVariantRestore(variant.id)}
                            disabled={variantLoading}
                            className="px-2 py-1 text-xs rounded bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* ── Add new variant ── */}
              {addingVariant ? (
                <div className="rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-600 p-4 space-y-3">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">New Variant</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Option 1 Name</label>
                      <input value={newVariant.option1_name} onChange={e => setNewVariant(p => ({ ...p, option1_name: e.target.value }))} placeholder="e.g. Color" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Option 1 Value</label>
                      <input value={newVariant.option1_value} onChange={e => setNewVariant(p => ({ ...p, option1_value: e.target.value }))} placeholder="e.g. Red" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Option 2 Name</label>
                      <input value={newVariant.option2_name} onChange={e => setNewVariant(p => ({ ...p, option2_name: e.target.value }))} placeholder="e.g. Size" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Option 2 Value</label>
                      <input value={newVariant.option2_value} onChange={e => setNewVariant(p => ({ ...p, option2_value: e.target.value }))} placeholder="e.g. M" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Price (฿) *</label>
                      <input type="number" value={newVariant.price} onChange={e => setNewVariant(p => ({ ...p, price: e.target.value }))} placeholder="0.00" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Stock *</label>
                      <input type="number" value={newVariant.stock} onChange={e => setNewVariant(p => ({ ...p, stock: e.target.value }))} placeholder="0" className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setAddingVariant(false)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
                      Cancel
                    </button>
                    <button onClick={handleAddVariant} disabled={variantLoading}
                      className="px-3 py-1.5 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50">
                      {variantLoading ? "Adding..." : "Add Variant"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingVariant(true)}
                  className="w-full py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  + Add Variant
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProductModal;