import { useState, useEffect, useMemo } from "react";
import { ProductsAPI } from "@/services/productsApi";

export const useProductDetail = (slug?: string) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho màu và size
  const [selectedColorId, setSelectedColorId] = useState<string | number>();
  const [selectedSize, setSelectedSize] = useState<string>();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const productId = slug.split("-").pop();
        if (productId) {
          const data = await ProductsAPI.getProductDetailById(productId);
          setProduct({
            ...data,
            name: data.productName,
            basePrice: data.price,
            mainImageUrl: data.image_url,
          });
        }
      } catch (err) {
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  // Tính toán options (colors, sizes)
  const options = useMemo(() => {
    if (!product?.variants) return { colors: [], sizes: [] };
    const colors = Array.from(
      new Map(
        product.variants
          .filter((v: any) => v.color)
          .map((v: any) => [v.color, { id: v.color, name: v.color }]),
      ).values(),
    );
    const sizes = Array.from(
      new Set(product.variants.map((v: any) => v.size).filter(Boolean)),
    );
    return { colors, sizes };
  }, [product]);

  // Tìm variant hiện tại
  const currentVariant = useMemo(() => {
    if (!product?.variants) return undefined;
    return product.variants.find(
      (v: any) =>
        (selectedColorId === undefined ||
          v.color === selectedColorId ||
          v.colorId === selectedColorId) &&
        (selectedSize === undefined || v.size === selectedSize),
    );
  }, [product, selectedColorId, selectedSize]);

  // Kiểm tra size có còn hàng không
  const isSizeAvailable = (size: string) => {
    if (!product?.variants) return false;
    return product.variants.some(
      (v: any) =>
        v.size === size &&
        (selectedColorId === undefined ||
          v.color === selectedColorId ||
          v.colorId === selectedColorId) &&
        v.stockQuantity > 0,
    );
  };

  // Số lượng tồn kho của variant hiện tại
  const currentStock = currentVariant?.stockQuantity ?? 0;
  const isOutOfStock = currentStock <= 0;

  // Giá hiển thị
  const displayPrice = currentVariant?.price ?? product?.basePrice ?? 0;

  return {
    product,
    loading,
    error,
    options,
    selectedColorId,
    setSelectedColorId,
    selectedSize,
    setSelectedSize,
    currentVariant,
    isSizeAvailable,
    currentStock,
    isOutOfStock,
    displayPrice,
  };
};
