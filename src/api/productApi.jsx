import api from "./ApiService.jsx";

const ProductApi = {
    fetchProducts: () => api.get("/api/v1/products/"),
    createProduct: (productData) => api.post("/api/v1/products/", productData ),
    fetchProductsByCategory: (category_name) => api.get(`/api/v1/categories/${category_name}/products`) //TODO
};

export default ProductApi;