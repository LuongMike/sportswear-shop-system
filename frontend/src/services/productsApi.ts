import api from "@/lib/axios";

export interface ProductFilters {
  categoryId?: number;
  brandId?: number;
  sportId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string; // brand slug cho UI filter
  color?: string; // filter theo màu sắc
}

export interface ColorInfo {
  name: string;
  hex?: string;
  image?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    slug: string;
    mainImageUrl: string;
    basePrice: number;
    brandName?: string;
    categoryName?: string;
    colors?: ColorInfo[];
    badge?: string;
  }[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
  };
}

export class ProductsAPI {
  static async getProducts(filters: ProductFilters = {}, page = 1, limit = 20): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters.categoryId)
      params.append("categoryId", filters.categoryId.toString());
    if (filters.brandId) params.append("brandId", filters.brandId.toString());
    if (filters.sportId) params.append("sportId", filters.sportId.toString());
    if (filters.search) params.append("q", filters.search);
    if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());

    const response = await api.get(`/api/products`, { params });
    const rawList = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];

    // Lọc theo giá trên frontend nếu backend không hỗ trợ
    let filteredList = rawList;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filteredList = rawList.filter((p: any) => {
        const price = p.price || 0;
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
        return true;
      });
    }

    // Lọc theo search trên frontend nếu cần
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredList = filteredList.filter((p: any) => {
        const name = (p.productName || "").toLowerCase();
        const brand = (p.brandName || "").toLowerCase();
        return name.includes(searchLower) || brand.includes(searchLower);
      });
    }

    // Lọc theo màu sắc
    if (filters.color) {
      const colorLower = filters.color.toLowerCase();
      filteredList = filteredList.filter((p: any) => {
        // Kiểm tra trong variants
        if (p.variants && Array.isArray(p.variants)) {
          return p.variants.some((v: any) => 
            v.color && v.color.toLowerCase() === colorLower
          );
        }
        // Kiểm tra trong colors array
        if (p.colors && Array.isArray(p.colors)) {
          return p.colors.some((c: any) => {
            const colorName = typeof c === 'string' ? c : c.name;
            return colorName && colorName.toLowerCase() === colorLower;
          });
        }
        return false;
      });
    }

    return {
      success: true,
      data: filteredList.map((p: any) => {
        // Trích xuất màu từ variants nếu có
        let colors: ColorInfo[] = [];
        if (p.variants && Array.isArray(p.variants)) {
          const colorMap = new Map<string, ColorInfo>();
          p.variants.forEach((v: any) => {
            if (v.color && !colorMap.has(v.color)) {
              colorMap.set(v.color, {
                name: v.color,
                image: v.imageUrls?.[0] || v.image_url,
              });
            }
          });
          colors = Array.from(colorMap.values());
        } else if (p.colors && Array.isArray(p.colors)) {
          // Nếu backend trả về colors trực tiếp
          colors = p.colors.map((c: any) => 
            typeof c === 'string' ? { name: c } : c
          );
        }

        return {
          id: p.id,
          name: p.productName,
          slug: `product-${p.id}`,
          mainImageUrl:
            p.image_url || p.variants?.[0]?.imageUrls?.[0] || "https://placehold.co/600x600?text=No+Image",
          basePrice: p.price || p.variants?.[0]?.price || 0,
          brandName: p.brandName,
          categoryName: p.categoryName,
          colors,
        };
      }),
      pagination: {
        total: filteredList.length,
        totalPages: Math.ceil(filteredList.length / limit) || 1,
        page: page,
      },
    };
  }
  static async getProductDetailById(id: string | number) {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }
}
