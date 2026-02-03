import api from "@/lib/axios";
import type {
  // BackendProduct,
  ProductSummary,
  ProductDetailResponse,
} from "@/types/api";

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  gender?: string;
  sport?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sort_by?: string;
  badge?: string;
  color?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: ProductSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ProductsAPI {
  // Get all products with filters and pagination
  static async getProducts(
    filters: ProductFilters = {},
    page = 1,
    limit = 16
  ): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    // Add pagination
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // Map filters to backend params
    if (filters.category) params.append("slugCategory", filters.category);
    if (filters.brand) params.append("slugBrand", filters.brand);
    if (filters.color) params.append("color", filters.color);
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters.gender) params.append("slugAudience", filters.gender);
    if (filters.sport) params.append("slugSport", filters.sport);
    if (filters.search) params.append("q", filters.search);
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    // if (filters.sort_by) params.append("sort_by", filters.sort_by); // Backend chưa implement sort
    // if (filters.badge) params.append("badge_slug", filters.badge); // Backend chưa implement badge filter

    const response = await api.get(`/api/products?${params}`);
    console.log("Products API Response:", response.data);
    console.log("product api param: ", params);
    return response.data;
  }

  static async getProductDetailBySlug(
    slug: string
  ): Promise<ProductDetailResponse> {
    const response = await api.get(`/api/products/slug/${slug}`);
    return response.data.data;
  }
}

export default ProductsAPI;
