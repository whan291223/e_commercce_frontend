import api from "./ApiService.jsx";

const ProductApi = {
    fetchProduct: () => api.get("/api/v1/products/"),
    createProduct: (productData) => api.post("/api/v1/products/", { productData }),
};

export default ProductApi;