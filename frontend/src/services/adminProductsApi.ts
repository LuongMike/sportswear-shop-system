import api from "@/lib/axios";

// Kiểu dữ liệu tương đối, bám theo BE (ProductSummaryResponse, ProductDetailResponse, VariantResponse)
export interface AdminProductSummary {
  id: number;
  productName: string;
  price?: number;
  brandName?: string;
  categoryName?: string;
  status?: string;
  image_url?: string;
  imageUrls?: string[];
  [key: string]: any;
}

export interface AdminProductDetail extends AdminProductSummary {
  description?: string;
  categoryName?: string;
  brandName?: string;
  sportName?: string;
  imageUrls?: string[];
  variants?: AdminVariant[];
}

export interface AdminVariant {
  id: number;
  color?: string;
  size?: string;
  price: number;
  stockQuantity: number;
  [key: string]: any;
}

export interface AdminProductRequest {
  productName: string;
  description?: string;
  categoryName: string;
  brandName: string;
  sportName: string;
  variants: AdminVariantRequest[];
  // Có thể bổ sung thêm các field khác theo ProductRequest BE
  [key: string]: any;
}

export interface AdminVariantRequest {
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  sku: string;
  imageUrls: string[];
}

export const adminProductsApi = {
  // GET /api/admin/products
  getAll: async (): Promise<AdminProductSummary[]> => {
    const res = await api.get("/api/admin/products");
    const data = res.data?.data ?? res.data ?? [];
    return Array.isArray(data) ? data : [];
  },

  // GET /api/admin/products/{id}
  getDetail: async (id: number): Promise<AdminProductDetail> => {
    const res = await api.get(`/api/admin/products/${id}`);
    return (res.data?.data ?? res.data) as AdminProductDetail;
  },

  // POST /api/admin/products
  create: async (payload: AdminProductRequest): Promise<AdminProductDetail> => {
    const res = await api.post("/api/admin/products", payload);
    return (res.data?.data ?? res.data) as AdminProductDetail;
  },

  // PUT /api/admin/products/{id}
  update: async (
    id: number,
    payload: Partial<AdminProductRequest>,
  ): Promise<AdminProductSummary> => {
    console.log("payload", payload);
    console.log("id", id);
    const res = await api.put(`/api/admin/products/${id}`, payload);
    return (res.data?.data ?? res.data) as AdminProductSummary;
  },

  // DELETE /api/admin/products/{id}
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/products/${id}`);
  },

  // POST /api/admin/products/{productId}/variants
  addVariant: async (
    productId: number,
    payload: AdminVariantRequest,
  ): Promise<AdminVariant> => {
    const res = await api.post(
      `/api/admin/products/${productId}/variants`,
      payload,
    );
    return (res.data?.data ?? res.data) as AdminVariant;
  },

  // PUT /api/admin/products/variants/{vId}
  updateVariant: async (
    variantId: number,
    payload: Partial<AdminVariantRequest>,
  ): Promise<AdminVariant> => {
    const res = await api.put(
      `/api/admin/products/variants/${variantId}`,
      payload,
    );
    return (res.data?.data ?? res.data) as AdminVariant;
  },

  // DELETE /api/admin/products/variants/{vId}
  deleteVariant: async (variantId: number): Promise<void> => {
    await api.delete(`/api/admin/products/variants/${variantId}`);
  },

  // PATCH /api/admin/products/variants/{vId}/stock?quantity=
  updateStock: async (variantId: number, quantity: number): Promise<void> => {
    await api.patch(
      `/api/admin/products/variants/${variantId}/stock`,
      null,
      {
        params: { quantity },
      },
    );
  },
};

