import api from './ApiService';

const OrderApi = {
  fetchOrders: async () => {
    return await api.get('/api/v1/orders/');
  },

  updateOrderStatus: async (orderId, newStatus) => {
    return await api.patch(`/api/v1/orders/${orderId}/status?new_status=${newStatus}`);
  }
};

export default OrderApi;