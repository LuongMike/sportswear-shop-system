import { useState, useEffect, useMemo, useCallback } from "react";
import ProductsAPI from "@/services/productsApi";
import type { ProductDetailResponse } from "@/types/api";

export const useProductDetail = (slug?: string) => {
  // --- A. State Fetching Dữ liệu ---
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- B. State Lựa chọn của Người dùng (Selection State) ---
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 1. Logic Fetching Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      // Reset trạng thái lựa chọn khi load sản phẩm mới
      setSelectedColorId(null);
      setSelectedSize(null);
      setQuantity(1);

      try {
        setLoading(true);
        setError(null);
        const data = await ProductsAPI.getProductDetailBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        const { getFallbackProductDetail } = await import("@/data");
        const fallback = getFallbackProductDetail(slug);
        if (fallback) {
          setProduct(fallback);
          setError(null);
        } else {
          setError("Không thể tải thông tin sản phẩm");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [slug]);

  // 2. Logic Khởi tạo lựa chọn ban đầu (chọn Variant đầu tiên)
  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedColorId) {
      const firstVariant = product.variants[0];
      setSelectedColorId(firstVariant.colorId);
      setSelectedSize(firstVariant.sizeName);
    }
  }, [product, selectedColorId]);

  // 3. Tính toán các Options duy nhất (Màu, Size)
  const options = useMemo(() => {
    if (!product) return { colors: [], sizes: [] };

    return {
      colors: product.colors,
      sizes: product.sizes,
    };
  }, [product]);

  // 4. Tìm Variant đang được chọn (Matching Variant)
  const currentVariant = useMemo(() => {
    if (!product || !selectedColorId || !selectedSize) return null;

    return (
      product.variants.find(
        (v) => v.colorId === selectedColorId && v.sizeName === selectedSize
      ) || null
    );
  }, [product, selectedColorId, selectedSize]);

  // 5. Logic Kiểm tra tính khả dụng của một Size khi đã chọn Màu
  const isSizeAvailable = useCallback(
    (sizeName: string) => {
      if (!product || !selectedColorId) return true;

      return product.variants.some(
        (v) => v.colorId === selectedColorId && v.sizeName === sizeName
      );
    },
    [product, selectedColorId]
  );

  // 6. Logic Kiểm tra tính khả dụng của một Màu khi đã chọn Size
  const isColorAvailable = useCallback(
    (colorId: number) => {
      if (!product || !selectedSize) return true;

      return product.variants.some(
        (v) => v.colorId === colorId && v.sizeName === selectedSize
      );
    },
    [product, selectedSize]
  );

  // 7. Giá, Tồn kho và Trạng thái
  const displayPrice = currentVariant
    ? Number(currentVariant.price)
    : product
    ? Number(product.basePrice)
    : 0;
  const currentStock = currentVariant?.stockQuantity ?? 0;
  const isOutOfStock = currentStock === 0;

  // 8. Handlers
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  return {
    // Data Fetching
    product,
    loading,
    error,

    // Selection & Availability
    options,
    selectedColorId,
    selectedSize,
    quantity,
    currentVariant,

    // Calculated State
    displayPrice,
    currentStock,
    isOutOfStock,

    // Actions
    setSelectedColorId,
    setSelectedSize,
    handleQuantityChange,
    isSizeAvailable,
    isColorAvailable,
  };
};
