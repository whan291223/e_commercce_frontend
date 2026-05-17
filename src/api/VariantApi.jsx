import axios from "axios";

const BASE = "/api/v1/product-variants";
const token = () => sessionStorage.getItem("jwt_token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

const VariantApi = {
  // POST /
  createVariant: (data) =>
    axios.post(`${BASE}/`, data, { headers: authHeader() }),

  // GET /
  getAllVariants: () =>
    axios.get(`${BASE}/`),

  // GET /in_active
  getInactiveVariants: () =>
    axios.get(`${BASE}/in_active`),

  // GET /{variant_id}
  getVariantById: (variantId) =>
    axios.get(`${BASE}/${variantId}`),

  // GET /product/{product_id}
  getVariantsByProduct: (productId) =>
    axios.get(`${BASE}/product/${productId}`),

  // PUT / (id is inside the body)
  updateVariant: (data) =>
    axios.put(`${BASE}/`, data, { headers: authHeader() }),

  // DELETE /{variant_id}
  deleteVariant: (variantId) =>
    axios.delete(`${BASE}/${variantId}`, { headers: authHeader() }),
};

export default VariantApi;