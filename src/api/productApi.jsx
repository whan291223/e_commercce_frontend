import api from "./ApiService.jsx";

const getAuthHeader = () => {
    const token = sessionStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}`} : {};
};

const ProductApi = {
    fetchProducts: () => api.get("/api/v1/products/", {headers: getAuthHeader()}),
    createProduct: (productData) => api.post("/api/v1/products/", productData, {headers: getAuthHeader()} ),
    fetchProductsByCategory: (category_name) => api.get(`/api/v1/categories/${category_name}/products`) //TODO
};

export default ProductApi;