import api from "@/lib/axios";

export interface OrderItem {
  quantity: number;
  price: number | string;
  productName: string;
  variantDetails: string;
  mainImageUrl: string | null;
}

export interface Order {
  orderId: number;
  orderCode: string;
  orderDate: string;
  status: string;
  totalFinalAmount: number | string;
  customerName: string;
  shippingAddress: string;
  items: OrderItem[];
  customerPhone: number;
  shipperName: string;
  shipperPhone: string;
  paymentMethod?: "cod" | "bank" | string;
}

export interface CreateOrderPayload {
  cartId: number;
  shippingAddressId: number;
  userPhoneId: number;
  note?: string;
}

export const OrderAPI = {
  // createOrder: async (payload: CreateOrderPayload) => {
  //   const response = await api.post("/api/orders", payload);
  //   return response.data.data;
  // },

  createOrder(data: {
    cartId: number;
    shippingAddressId: number;
    userPhoneId: number;
    note?: string;
    paymentMethod: "cod" | "bank";
  }) {
    return api.post("/orders", data).then((res) => res.data);
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
