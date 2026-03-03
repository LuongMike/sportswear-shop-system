import React from "react";
import {
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ProductInfoProps = ReturnType<typeof useProductDetail>;

const ProductInfo = ({
  product,
  options,
  selectedColorId,
  setSelectedColorId,
  selectedSize,
  setSelectedSize,
  isSizeAvailable,
  displayPrice,
  quantity,
  handleQuantityChange,
  currentStock,
  isOutOfStock,
  currentVariant,
}: ProductInfoProps) => {
  const { addToCart, isAdding } = useCartStore();
  const navigate = useNavigate();

  // BẢO VỆ: Nếu chưa có dữ liệu product thì hiện Skeleton
  // Không chặn bởi !options vì options có thể được tạo chậm hơn một chút
  if (!product || !product.id) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-12 bg-gray-200 rounded w-full"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  // --- ÁNH XẠ DỮ LIỆU THỰC TẾ TỪ API CỦA BẠN ---
  const productName = (product as any).productName || product.name;
  const brandName = product.brandName || "Thương hiệu";

  // API trả về basePrice: undefined trong log, nên ta lấy giá của variant đầu tiên làm mặc định
  const basePrice = Number(
    (product as any).price ||
      product.basePrice ||
      product.variants?.[0]?.price ||
      0,
  );

  const colors =
    options?.colors && options.colors.length > 0
      ? options.colors
      : Array.from(
          new Map(
            (product.variants || [])
              .filter((v) => v.color)
              .map((v) => [v.color, { id: v.color, name: v.color }]),
          ).values(),
        );

  const sizes =
    options?.sizes && options.sizes.length > 0
      ? options.sizes
      : Array.from(
          new Set((product.variants || []).map((v) => v.size).filter(Boolean)),
        );

  // Tìm tên màu đã chọn an toàn
  const selectedColorName =
    colors.find((c) => c.id === selectedColorId)?.name || "Vui lòng chọn màu";

  const getProductInfoForCart = () => {
    if (!currentVariant || !product) return undefined;
    const color = colors.find((c) => c.id === selectedColorId);
    return {
      productName: productName,
      productSlug: (product as any).slug || `product-${product.id}`,
      brandName: brandName,
      mainImageUrl:
        currentVariant.imageUrls?.[0] ||
        (currentVariant as any).image_url ||
        "",
      variantId: currentVariant.id,
      sku: currentVariant.sku,
      price: currentVariant.price,
      colorName: color?.name,
      sizeName: selectedSize || undefined,
    };
  };

  const handleAddToCart = async () => {
    if (!selectedColorId) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    if (!currentVariant) {
      toast.error("Vui lòng chọn đầy đủ màu sắc và kích thước");
      return;
    }
    if (qty <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    await addToCart(currentVariant.id, qty, getProductInfoForCart());
  };

  const handleBuyNow = async () => {
    if (!selectedColorId) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    if (!selectedSize) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    if (!currentVariant) {
      toast.error("Vui lòng chọn đầy đủ màu sắc và kích thước");
      return;
    }
    if (qty <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    await addToCart(currentVariant.id, qty, getProductInfoForCart());
    navigate("/checkout");
  };

  // Ánh xạ tên màu sang mã màu hex
  const COLOR_MAP: Record<string, string> = {
    Đen: "#222",
    Trắng: "#fff",
    Xám: "#888",
    Xanh: "#2196f3",
    Đỏ: "#e53935",
    Vàng: "#ffeb3b",
    Nâu: "#795548",
    // ... thêm các màu khác nếu cần
  };

  // Quantity state and handler (if not provided by parent)
  const [internalQuantity, setInternalQuantity] = React.useState(1);
  const qty = typeof quantity === "number" ? quantity : internalQuantity;
  const onQuantityChange =
    handleQuantityChange ||
    ((delta: number) => {
      setInternalQuantity((prev) => {
        let next = prev + delta;
        if (next < 1) next = 1;
        if (next > currentStock) next = currentStock;
        return next;
      });
    });
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > currentStock) val = currentStock;
    if (handleQuantityChange) {
      handleQuantityChange(val - qty);
    } else {
      setInternalQuantity(val);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-500 tracking-wide uppercase">
          {brandName}
        </h2>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {productName}
        </h1>
      </div>

      {/* Price Section */}
      <div className="flex items-end gap-4">
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(displayPrice || basePrice)}
        </p>
        {basePrice > (displayPrice || 0) && displayPrice !== 0 && (
          <p className="text-lg text-gray-400 line-through mb-1">
            {formatCurrency(basePrice)}
          </p>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Colors Selection */}
      <div>
        <p className="mb-2 text-sm text-gray-700">
          Màu sắc:{" "}
          <span className="font-bold uppercase text-black">
            {selectedColorName}
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {colors.length > 0 ? (
            colors.map((color) => {
              const variantWithColor = product.variants?.find(
                (v) =>
                  (v as any).color === color.color || v.colorId === color.id,
              );
              const imageUrl =
                variantWithColor?.imageUrls?.[0] ||
                (variantWithColor as any)?.image_url;

              return (
                <button
                  key={color.id}
                  className={cn(
                    "w-16 h-16 border rounded-md p-1 overflow-hidden transition-all",
                    selectedColorId === color.id
                      ? "border-black ring-2 ring-black"
                      : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100",
                  )}
                  onClick={() => setSelectedColorId(color.id)}
                  title={color.name}
                >
                  {imageUrl && imageUrl.trim() !== "" ? (
                    <img
                      src={imageUrl}
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded"
                      style={{
                        backgroundColor: COLOR_MAP[color.name] || "#ccc",
                      }}
                    />
                  )}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-gray-400 italic">Đang tải màu sắc...</p>
          )}
        </div>
      </div>

      {/* Sizes Selection */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-gray-900 uppercase">
          Kích thước
        </span>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {sizes.map((size) => {
            const isSelected = selectedSize === size;
            const isSizeAvailable = (size) => {
              // logic kiểm tra size có trong variants hoặc còn hàng
              return product.variants.some(
                (v) => v.size === size && v.stockQuantity > 0,
              );
            };
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                disabled={!isSizeAvailable(size)}
                className={cn(
                  "flex items-center justify-center rounded-md border py-2.5 text-sm font-medium transition-all",
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-900",
                  !isSizeAvailable(size) &&
                    "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400 line-through",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Stock Status */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-md h-11">
            <Button
              onClick={() => onQuantityChange(-1)}
              disabled={qty <= 1 || isOutOfStock}
              className="px-3 h-full hover:bg-gray-100 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              min={1}
              max={currentStock}
              value={qty}
              onChange={onInputChange}
              className="w-18 text-center font-bold border-none outline-none bg-transparent"
            />
            <Button
              onClick={() => onQuantityChange(1)}
              disabled={qty >= currentStock || isOutOfStock}
              className="px-3 h-full hover:bg-gray-100 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-sm">
            {isOutOfStock ? (
              <span className="text-red-500 font-bold uppercase">Hết hàng</span>
            ) : (
              <span className="text-green-600 font-medium">
                {currentStock} sản phẩm có sẵn
              </span>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="flex-1 bg-black text-white h-12 rounded-md font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest hover:bg-zinc-800 active:scale-95 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            className="flex-1 border-2 border-black text-black h-12 rounded-md font-bold hover:bg-black hover:text-white transition-all uppercase tracking-widest active:scale-95 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
          >
            Mua ngay
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-black" />
          <span>Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-black" />
          <span>Hàng chính hãng 100% - Bảo hành uy tín</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
