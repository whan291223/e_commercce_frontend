import api from "./ApiService.jsx";

const ProductApi = {
    fetchProducts: () => api.get("/api/v1/products/"),
    createProduct: (productData) => api.post("/api/v1/products/", { productData }),
};

export default ProductApi;