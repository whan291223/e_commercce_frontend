import api from "./ApiService.jsx";

const CategoryApi = {
    fetchCategories: () => api.get("/api/v1/categories/"),
    createCategory: (name) => api.post("/api/v1/categories/", { name }),
};

export default CategoryApi;