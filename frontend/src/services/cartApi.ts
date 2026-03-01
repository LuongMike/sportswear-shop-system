import api from "@/lib/axios";

/** BE cart item: { id?, productId, productName, quantity, price } */
export interface CartItem {
  id?: number;
  itemId?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number | string;
  isSelected?: boolean;
  product?: {
    name: string;
    slug?: string;
    brandName?: string;
    mainImageUrl?: string;
  };
  variant?: {
    variantId?: number;
    sku?: string;
    price: string | number;
    stockQuantity?: number;
    color?: { name: string; hexCode?: string } | null;
    size?: { name: string } | null;
    image?: string;
  };
}

/** BE: { items, total } - hỗ trợ cả format cũ có id, totalItems, totalPrice */
export interface CartResponse {
  id?: number;
  userId?: number;
  items: CartItem[];
  total?: number;
  totalItems?: number;
  totalPrice?: string | number;
}

function normalizeCart(raw: unknown): { success: boolean; data: CartResponse } {
  const d = raw as Record<string, unknown>;
  const items = (d?.items ?? d?.data?.items ?? []) as CartItem[];
  const total = d?.total ?? d?.data?.total ?? d?.totalPrice ?? 0;
  const data: CartResponse = {
    items: items.map((i: Record<string, unknown>) => ({
      ...i,
      itemId: (i.itemId ?? i.id ?? i.productId) as number,
      product: i.product ?? {
        name: (i.productName as string) ?? "",
        mainImageUrl: (i.image as string) ?? "",
      },
      variant: i.variant ?? {
        price: i.price ?? 0,
        variantId: i.productId,
        color: null,
        size: null,
        image: (i.image as string) ?? "",
      },
    })),
    total: typeof total === "string" ? parseFloat(total) : Number(total),
    totalItems: items.reduce(
      (s: number, i: CartItem) => s + (i.quantity || 0),
      0,
    ),
    totalPrice: String(total),
  };
  return { success: true, data };
}

export const cartApi = {
  getCart: async () => {
    const response = await api.get("/api/cart");
    const raw = response.data?.data ?? response.data;
    return normalizeCart(raw ?? { items: [], total: 0 });
  },

  addToCart: async (productIdOrVariantId: number, quantity: number) => {
    console.log("Adding to cart:", { productIdOrVariantId, quantity });
    const response = await api.post("/api/cart/add", {
      variantId: productIdOrVariantId,
      quantity,
    });
    const raw = response.data?.data ?? response.data;
    return normalizeCart(raw ?? { items: [], total: 0 });
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    const response = await api.put(
      `/api/cart/items/${itemId}?quantity=${quantity}`,
    );
    const raw = response.data?.data ?? response.data;
    return normalizeCart(raw ?? { items: [], total: 0 });
  },

  removeCartItem: async (itemId: number) => {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    const raw = response.data?.data ?? response.data;
    return normalizeCart(raw ?? { items: [], total: 0 });
  },

  getCartCount: async () => {
    const res = await api.get("/api/cart");
    const raw = res.data?.data ?? res.data;
    const items = (raw?.items ?? []) as CartItem[];
    const count = items.reduce(
      (s: number, i: CartItem) => s + (i.quantity ?? 0),
      0,
    );
    return { success: true, data: { count } };
  },

  clearCart: async () => {
    await api.delete("/api/cart/clear");
    return { success: true, data: { items: [], total: 0, totalPrice: "0" } };
  },
};
