// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  error?: string;
}

// Brand Type
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  banner: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Type
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | Category;
  image?: string;
  isActive: boolean;
  level: number;
  path: string;
}

// Color Type
export interface Color {
  _id: string;
  name: string;
  hex: string;
}

// Size Type
export interface Size {
  _id: string;
  name: string;
}

// Variant Type
export interface Variant {
  _id: string;
  variant_id: string;
  color: Color;
  size: Size;
  price: number | null;
  stock_quantity: number;
  sku: string | null;
}

// Backend Product Type (Matches API Response)
export interface BackendProduct {
  _id: string;
  name: string;
  slug: string;
  brand: {
    _id: string;
    name: string;
  };
  base_price: number;
  is_active: boolean;
  description: string | null;
  specifications: string | null;
  note: string | null;
  sports: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  category_ids: Array<{
    _id: {
      _id: string;
      name: string;
      slug: string;
      parent_id: string | null;
    };
    is_primary: boolean;
  }>;
  images: Array<{
    image_id: string;
    url: string;
    sort_order: number;
    is_main: boolean;
    variant_ids?: string[];
  }>;
  attributes: Array<{
    attr_id: string;
    value_ids: string[];
    custom_name?: string;
    custom_values?: string[];
    is_custom: boolean;
    name?: string;
    code?: string;
    values?: Array<{ _id: string; value: string }>;
  }>;
  variants: Variant[];
  badge?: {
    _id: string;
    slug: string;
    display_text: string;
    display_color: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductBadge {
  slug: string;
  display_text: string;
  display_color: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  basePrice: string | number;
  brandName?: string;
  mainImageUrl: string | null;
  badgeId?: number | null;
  colors?: string[];
  badge?: ProductBadge; // Giữ lại nếu cần map thêm ở frontend hoặc backend trả về object badge
}

// Navigation Types
export interface NavigationItem {
  id: string;
  name: string;
  slug: string;
  /** Khi dùng fallback từ data, dùng href gốc thay vì build từ slug */
  href?: string;
}

export interface NavigationColumn {
  id: string;
  name: string;
  items: NavigationItem[];
}

export const NAVIGATION_TYPE = {
  STATIC: "STATIC",
  CATEGORY: "CATEGORY",
  GENDER: "GENDER",
} as const;

export interface NavigationRoot {
  id: string;
  name: string;
  slug: string;
  type: (typeof NAVIGATION_TYPE)[keyof typeof NAVIGATION_TYPE];
  children: NavigationColumn[];
  /** Khi dùng fallback từ data, dùng parentHref gốc thay vì build từ slug */
  parentHref?: string;
}

export type NavigationStructure = NavigationRoot[];

export interface ProductDetailResponse {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  brand: {
    id: number;
    name: string;
    slug: string;
  } | null;
  basePrice: string;
  description: string | null;
  specifications: string | null;
  note: string | null;
  colors: {
    id: number;
    name: string;
    hexCode: string;
  }[];
  sizes: string[];
  attributes: {
    name: string;
    value: string[];
  }[];
  variants: {
    id: number;
    sku: string;
    price: string;
    stockQuantity: number;
    colorId: number;
    sizeName: string;
    imageUrls: string[];
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  audiences: {
    id: number;
    name: string;
    slug: string;
  }[];
  sports: {
    id: number;
    name: string;
    slug: string;
  }[];
}
