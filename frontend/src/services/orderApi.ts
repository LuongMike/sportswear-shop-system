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

function getAccessToken() {
  const authStorage = localStorage.getItem("auth-storage");
  if (!authStorage) return null;
  try {
    const parsed = JSON.parse(authStorage);
    return parsed.state?.accessToken || null;
  } catch {
    return null;
  }
}

export const OrderAPI = {
  // createOrder: async (payload: CreateOrderPayload) => {
  //   const response = await api.post("/api/orders", payload);
  //   return response.data.data;
  // },

  /** BE: POST /api/orders/checkout trả { id, status, total, items, createdAt } */
  createOrder: async (data: {
    cartId?: number;
    shippingAddressId: number;
    userPhoneId?: number;
    addressDetail?: string;
    phone?: string;
    note?: string;
    paymentMethod: "cod" | "bank";
  }) => {
    const response = await api.post("/api/orders/checkout", data);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get(`/api/orders`);

    return response.data?.data ?? response.data ?? [];
  },

  getAllOrders: async () => {
    const bearToken = getAccessToken();
    const response = await api.get(`/api/orders/admin`, {
      headers: {
        Authorization: `Bearer ${bearToken}`,
      },
    });

    return response.data?.data ?? response.data ?? [];
  },

  getOrderById: async (orderId: number) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data?.data ?? response.data;
  },

  /** BE: PATCH /api/orders/{id}/status?status=... */
  updateOrderStatus: async (orderId: number, status: string) => {
    const bearToken = getAccessToken();
    const response = await api.patch(
      `/api/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${bearToken}`,
        },
      },
    );
    return response.data;
  },
};
