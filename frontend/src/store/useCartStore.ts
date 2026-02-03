import { create } from "zustand";
import { cartApi } from "@/services/cartApi";
import type { CartResponse } from "@/services/cartApi";
import {
  getLocalCart,
  addToLocalCart,
  updateLocalCartItem,
  removeLocalCartItem,
  isLocalCart,
} from "@/data/mockCart";
import type { AddToCartProductInfo } from "@/data/mockCart";
import { toast } from "sonner";

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
      }
    } catch {
      const localCart = getLocalCart();
      if (localCart.items.length > 0) {
        set({ cart: localCart });
      }
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
