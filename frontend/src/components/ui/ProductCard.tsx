// components/ui/ProductCard.tsx
import { Link } from "react-router";

// Map tên màu sang mã hex
const COLOR_MAP: Record<string, string> = {
  "Đen": "#222222",
  "Trắng": "#FFFFFF",
  "Xám": "#888888",
  "Xanh": "#2196F3",
  "Xanh dương": "#1E88E5",
  "Xanh lá": "#4CAF50",
  "Đỏ": "#E53935",
  "Vàng": "#FFC107",
  "Nâu": "#795548",
  "Hồng": "#E91E63",
  "Cam": "#FF9800",
  "Tím": "#9C27B0",
  "Be": "#D7CCC8",
  "Navy": "#1A237E",
  "Bạc": "#C0C0C0",
};

export interface ColorInfo {
  name: string;
  hex?: string;
  image?: string;
}

interface ProductCardProps {
  name: string;
  image: string;
  originalPrice: string | number;
  salePrice?: string | number;
  brand: string;
  slug?: string;
  breadcrumb?: { label: string; href: string }[];
  colors?: ColorInfo[];
}

const ProductCard = ({
  name,
  image,
  originalPrice,
  salePrice,
  brand,
  slug,
  breadcrumb,
  colors = [],
}: ProductCardProps) => {
  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  // Lấy tối đa 5 màu để hiển thị
  const displayColors = colors.slice(0, 5);
  const remainingColors = colors.length - 5;

  const content = (
    <div className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
        <img
          src={image || "https://placehold.co/600x600?text=No+Image"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
          {brand}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 h-10 group-hover:text-red-600">
          {name}
        </h3>
        
        {/* Color Swatches */}
        {displayColors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {displayColors.map((color, idx) => {
              const bgColor = color.hex || COLOR_MAP[color.name] || "#ccc";
              return (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: bgColor }}
                  title={color.name}
                />
              );
            })}
            {remainingColors > 0 && (
              <span className="text-[10px] text-gray-500 ml-1">
                +{remainingColors}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-sm font-bold text-red-600">
            {formatPrice(salePrice || originalPrice)}
          </span>
          {salePrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Trả về Link nếu có slug (dạng product-ID)
  if (slug) {
    return (
      <Link
        to={`/product/${slug}`}
        state={{ breadcrumb }}
        className="group block h-full"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default ProductCard;
