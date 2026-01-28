import api from './ApiService';

const OrderApi = {
  fetchOrders: async () => {
    return await api.get('/api/v1/orders/');
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const token = sessionStorage.getItem('jwt_token');
    return await api.patch(
        `/api/v1/orders/${orderId}/status?new_status=${newStatus}`,
        {}, // empty body
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
    )
}
};

export default OrderApi;