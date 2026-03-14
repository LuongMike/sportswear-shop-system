/**
 * Fallback data - dùng khi API không thành công
 */

export {
  fallbackBrands,
  fallbackBrandsResponse,
} from "./brands";

export {
  fallbackColors,
  fallbackColorsResponse,
} from "./colors";

export {
  fallbackProducts,
  fallbackProductsResponse,
  getFallbackProductsByBrand,
} from "./products";

export { getFallbackProductDetail } from "./productDetail";

export {
  MOCK_CREDENTIALS,
  MOCK_USER,
  isMockCredentials,
  isMockToken,
} from "./mockAuth";

export {
  getLocalCart,
  addToLocalCart,
  updateLocalCartItem,
  removeLocalCartItem,
  isLocalCart,
} from "./mockCart";
export type { AddToCartProductInfo } from "./mockCart";
