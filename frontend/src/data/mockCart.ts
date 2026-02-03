import type { CartResponse, CartItem } from "@/services/cartApi";

const CART_STORAGE_KEY = "sportshop-local-cart";

export interface AddToCartProductInfo {
  productName: string;
  productSlug: string;
  brandName: string;
  mainImageUrl: string;
  variantId: number;
  sku: string;
  price: string | number;
  colorName?: string;
  sizeName?: string;
}

export function getLocalCart(): CartResponse {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CartResponse;
    }
  } catch (e) {
    console.warn("Failed to parse local cart", e);
  }
  return {
    id: -1,
    userId: 0,
    totalItems: 0,
    totalPrice: "0",
    items: [],
  };
}

function saveLocalCart(cart: CartResponse): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("Failed to save local cart", e);
  }
}

/**
 * Thêm sản phẩm vào giỏ local (khi API lỗi)
 */
export function addToLocalCart(
  variantId: number,
  quantity: number,
  productInfo: AddToCartProductInfo
): CartResponse {
  const cart = getLocalCart();
  const existingIndex = cart.items.findIndex(
    (i) => i.variant.variantId === variantId
  );

  const newItem: CartItem = {
    itemId: -Date.now(),
    quantity,
    isSelected: true,
    product: {
      name: productInfo.productName,
      slug: productInfo.productSlug,
      brandName: productInfo.brandName,
      mainImageUrl: productInfo.mainImageUrl || "https://placehold.co/100",
    },
    variant: {
      variantId,
      sku: productInfo.sku,
      price: String(productInfo.price),
      stockQuantity: 99,
      color: productInfo.colorName
        ? { name: productInfo.colorName, hexCode: "#000" }
        : null,
      size: productInfo.sizeName ? { name: productInfo.sizeName } : null,
      image: productInfo.mainImageUrl || "https://placehold.co/100",
    },
  };

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push(newItem);
  }

  cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.totalPrice = cart.items
    .reduce((s, i) => s + Number(i.variant.price) * i.quantity, 0)
    .toFixed(0);

  saveLocalCart(cart);
  return cart;
}

/**
 * Cập nhật số lượng item trong giỏ local
 */
export function updateLocalCartItem(
  itemId: number,
  quantity: number
): CartResponse | null {
  const cart = getLocalCart();
  const item = cart.items.find((i) => i.itemId === itemId);
  if (!item) return null;

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.itemId !== itemId);
  } else {
    item.quantity = quantity;
  }

  cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.totalPrice = cart.items
    .reduce((s, i) => s + Number(i.variant.price) * i.quantity, 0)
    .toFixed(0);

  saveLocalCart(cart);
  return cart;
}

/**
 * Xóa item khỏi giỏ local
 */
export function removeLocalCartItem(itemId: number): CartResponse | null {
  return updateLocalCartItem(itemId, 0);
}

/**
 * Kiểm tra cart có phải từ local storage không (itemId âm)
 */
export function isLocalCart(cart: CartResponse | null): boolean {
  return (
    cart !== null &&
    (cart.id < 0 || cart.items.some((i) => i.itemId < 0))
  );
}
