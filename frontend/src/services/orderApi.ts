import api from "@/lib/axios";

export interface OrderItem {
  quantity: number;
  price: string;
  productName: string;
  variantDetails: string;
  mainImageUrl: string | null;
}

export interface Order {
  orderId: number;
  orderCode: string;
  orderDate: string;
  status: string;
  totalFinalAmount: string;
  receiverName: string;
  shippingAddress: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  cartId: number;
  shippingAddressId: number;
  userPhoneId: number;
  note?: string;
}

export const OrderAPI = {
  createOrder: async (payload: CreateOrderPayload) => {
    const response = await api.post("/api/orders", payload);
    return response.data.data;
  },

  getOrders: async (page = 1, limit = 10) => {
    const response = await api.get(`/api/orders?page=${page}&limit=${limit}`);
    return response.data.data; // { orders: [], pagination: {} }
  },

  getOrderById: async (orderId: number) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data.data;
  },
};
