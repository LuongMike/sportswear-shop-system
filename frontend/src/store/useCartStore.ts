import { create } from "zustand";
import { cartApi } from "@/services/cartApi";
import type { CartResponse } from "@/services/cartApi";
import {
  getLocalCart,
  addToLocalCart,
  updateLocalCartItem,
  removeLocalCartItem,
  isLocalCart,
  clearLocalCart,
} from "@/data/mockCart";
import type { AddToCartProductInfo } from "@/data/mockCart";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface CartState {
  cart: CartResponse | null;
  isLoading: boolean;
  isAdding: boolean;
  updatingItems: number[];

  fetchCart: () => Promise<void>;
  addToCart: (
    variantId: number,
    quantity: number,
    productInfo?: AddToCartProductInfo
  ) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isAdding: false,
  updatingItems: [],

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartApi.getCart();
      if (res.success) {
        set({ cart: res.data });
      } else {
        set({ cart: null });
      }
    } catch {
      // Nếu gọi API giỏ hàng lỗi (ví dụ chưa đăng nhập) thì không dùng lại giỏ hàng local
      // để tránh trường hợp sau khi đăng xuất vẫn còn sản phẩm cũ trong giỏ
      set({ cart: null });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (
    variantId: number,
    quantity: number,
    productInfo?: AddToCartProductInfo
  ) => {
    set({ isAdding: true });
    try {
      const res = await cartApi.addToCart(variantId, quantity);
      if (res.success) {
        set({ cart: res.data });
        toast.success("Đã thêm vào giỏ hàng");
      }
    } catch {
      if (productInfo) {
        const localCart = addToLocalCart(variantId, quantity, productInfo);
        set({ cart: localCart });
        toast.success("Đã thêm vào giỏ hàng (chế độ offline)");
      } else {
        toast.error("Không thể thêm vào giỏ hàng");
      }
    } finally {
      set({ isAdding: false });
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    if (get().updatingItems.includes(itemId)) return;

    const { cart } = get();
    if (isLocalCart(cart)) {
      const updated = updateLocalCartItem(itemId, quantity);
      if (updated) set({ cart: updated });
      return;
    }

    set((state) => ({ updatingItems: [...state.updatingItems, itemId] }));
    try {
      const res = await cartApi.updateCartItem(itemId, quantity);
      if (res.success) set({ cart: res.data });
    } catch {
      const localCart = getLocalCart();
      if (localCart.items.some((i) => i.itemId === itemId)) {
        const updated = updateLocalCartItem(itemId, quantity);
        if (updated) set({ cart: updated });
      } else {
        toast.error("Lỗi cập nhật số lượng");
      }
    } finally {
      set((state) => ({
        updatingItems: state.updatingItems.filter((id) => id !== itemId),
      }));
    }
  },

  removeItem: async (itemId: number) => {
    if (get().updatingItems.includes(itemId)) return;

    const { cart } = get();
    if (isLocalCart(cart)) {
      const updated = removeLocalCartItem(itemId);
      if (updated) {
        set({ cart: updated });
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      }
      return;
    }

    set((state) => ({ updatingItems: [...state.updatingItems, itemId] }));
    try {
      const res = await cartApi.removeCartItem(itemId);
      if (res.success) {
        set({ cart: res.data });
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      }
    } catch {
      const updated = removeLocalCartItem(itemId);
      if (updated) {
        set({ cart: updated });
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      } else {
        toast.error("Không thể xóa sản phẩm");
      }
    } finally {
      set((state) => ({
        updatingItems: state.updatingItems.filter((id) => id !== itemId),
      }));
    }
  },
}));

// Lắng nghe thay đổi auth:
// - Khi đăng xuất: reset giỏ + xoá local cart
// - Khi đăng nhập: gọi lại API giỏ hàng 1 lần
useAuthStore.subscribe(
  (state) => state.accessToken,
  (accessToken, previousAccessToken) => {
    // Đăng xuất
    if (!accessToken && previousAccessToken) {
      clearLocalCart();
      useCartStore.setState({
        cart: null,
        isLoading: false,
        isAdding: false,
        updatingItems: [],
      });
    }

    // Vừa đăng nhập (trước đó chưa có token)
    if (accessToken && !previousAccessToken) {
      const { fetchCart } = useCartStore.getState();
      fetchCart();
    }
  },
);
