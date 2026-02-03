import React from "react";
import {
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCartIcon,
  Truck,
} from "lucide-react";
import type { useProductDetail } from "@/hooks/useProductDetail";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Sử dụng ReturnType của hook để đảm bảo props đồng bộ
type ProductInfoProps = ReturnType<typeof useProductDetail>;

const ProductInfo = ({
  product,
  options,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize,
  isSizeAvailable,
  isColorAvailable,
  displayPrice,
  quantity,
  handleQuantityChange,
  currentStock,
  isOutOfStock,
  currentVariant,
}: ProductInfoProps) => {
  const { addToCart, isAdding } = useCartStore();
  const navigate = useNavigate();

  if (!product) return null;

  const selectedColorName =
    options.colors.find((c) => c.id === selectedColorId)?.name ||
    "Đang cập nhật";

  const getProductInfoForCart = () => {
    if (!currentVariant || !product) return undefined;
    const color = options.colors.find((c) => c.id === selectedColorId);
    return {
      productName: product.name,
      productSlug: product.slug,
      brandName: product.brandName || "",
      mainImageUrl: currentVariant.imageUrls[0] || "",
      variantId: currentVariant.id,
      sku: currentVariant.sku,
      price: currentVariant.price,
      colorName: color?.name,
      sizeName: selectedSize || undefined,
    };
  };

  const handleAddToCart = async () => {
    if (!currentVariant) {
      toast.error("Vui lòng chọn màu sắc và kích thước");
      return;
    }
    await addToCart(
      currentVariant.id,
      quantity,
      getProductInfoForCart()
    );
  };

  const handleBuyNow = async () => {
    if (!currentVariant) {
      toast.error("Vui lòng chọn màu sắc và kích thước");
      return;
    }
    await addToCart(
      currentVariant.id,
      quantity,
      getProductInfoForCart()
    );
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-500 tracking-wide uppercase">
          {product.brandName}
        </h2>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium text-black">SKU:</span>
            <span>{currentVariant?.sku || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-4">
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(displayPrice)}
        </p>
        {Number(product.basePrice) > displayPrice && (
          <p className="text-lg text-gray-400 line-through mb-1">
            {formatCurrency(Number(product.basePrice))}
          </p>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Colors */}
      <div>
        <p className="mb-2">
          Màu sắc:{" "}
          <span className="font-medium uppercase">{selectedColorName}</span>
        </p>
        <div className="flex items-center gap-3">
          {options.colors.map((color) => {
            // Find a representative image for this color
            const variantWithColor = product.variants.find(
              (v) => v.colorId === color.id
            );
            const imageUrl = variantWithColor?.imageUrls[0];

            return (
              <button
                className={cn(
                  "w-16 h-16 border rounded p-1 overflow-hidden",
                  selectedColorId === color.id
                    ? "border-black ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400"
                )}
                key={color.id}
                onClick={() => setSelectedColorId(color.id)}
                title={color.name}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={color.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color.hexCode }}
                  ></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Kích thước</span>
          <button className="text-sm text-blue-600 underline hover:text-blue-800">
            Hướng dẫn chọn size
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {options.sizes.map((size) => {
            const isSelected = selectedSize === size;
            const isAvailable = isSizeAvailable(size);
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!isAvailable}
                className={cn(
                  "flex items-center justify-center rounded-md border py-2.5 text-sm font-medium transition-all",
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-900",
                  !isAvailable &&
                    "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400 hover:border-gray-200 decoration-slice line-through"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-md h-11">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isOutOfStock}
              className="px-3 h-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= currentStock || isOutOfStock}
              className="px-3 h-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {isOutOfStock ? (
              <span className="text-red-500 font-medium">Hết hàng</span>
            ) : (
              `${currentStock} sản phẩm có sẵn`
            )}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="flex-1 bg-black text-white h-12 rounded-md font-bold  transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide hover:text-red-600"
          >
            {isAdding ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingCartIcon className="w-5 h-5" />
            )}
            {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock || isAdding}
            className="flex-1 border-2 border-black text-black h-12 rounded-md font-bold hover:text-red-500 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed uppercase tracking-wide"
          >
            Mua ngay
          </button>
          {/* <button className="h-12 w-12 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 hover:text-red-500 transition-colors">
            <Heart className="w-6 h-6" />
          </button> */}
        </div>
      </div>

      {/* Trust Badges / Policies */}
      <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-gray-400" />
          <span>Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫</span>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-gray-400" />
          <span>Đổi trả miễn phí trong vòng 30 ngày</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-gray-400" />
          <span>Hàng chính hãng 100% - Bảo hành uy tín</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
