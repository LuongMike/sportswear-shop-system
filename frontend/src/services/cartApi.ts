import api from "@/lib/axios";

export interface CartItem {
  itemId: number;
  quantity: number;
  isSelected: boolean;
  product: {
    name: string;
    slug: string;
    brandName: string;
    mainImageUrl: string;
  };
  variant: {
    variantId: number;
    sku: string;
    price: string;
    stockQuantity: number;
    color: { name: string; hexCode: string } | null;
    size: { name: string } | null;
    image: string;
  };
}

export interface CartResponse {
  id: number;
  userId: number;
  totalItems: number;
  totalPrice: string;
  items: CartItem[];
}

export const cartApi = {
  getCart: async () => {
    const response = await api.get<{ success: boolean; data: CartResponse }>(
      "/api/cart"
    );
    return response.data;
  },

  addToCart: async (variantId: number, quantity: number) => {
    const response = await api.post<{ success: boolean; data: CartResponse }>(
      "/api/cart/items",
      {
        variantId,
        quantity,
      }
    );
    return response.data;
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    const response = await api.patch<{ success: boolean; data: CartResponse }>(
      `/api/cart/items/${itemId}`,
      {
        quantity,
      }
    );
    return response.data;
  },

  removeCartItem: async (itemId: number) => {
    const response = await api.delete<{
      success: boolean;
      data: CartResponse;
      message: string;
    }>(`/api/cart/items/${itemId}`);
    return response.data;
  },

  getCartCount: async () => {
    const response = await api.get<{
      success: boolean;
      data: { count: number };
    }>("/api/cart/items/count");
    return response.data;
  },
};
