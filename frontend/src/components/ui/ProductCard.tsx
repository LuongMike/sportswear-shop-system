import { Badge } from "@/components/ui/badge";
import type { ProductBadge } from "@/types/api";
import { Link } from "react-router";

interface ProductCardProps {
  name: string;
  image: string;
  originalPrice: string | number;
  salePrice?: string | number;
  badge?: ProductBadge;
  rating?: number;
  // reviews?: number;
  colors?: string[];
  brand: string;
  className?: string;
  slug?: string;
  breadcrumb?: { label: string; href: string }[]; // Thêm prop breadcrumb
}

const ProductCard = ({
  name,
  image,
  originalPrice,
  salePrice,
  badge,
  // rating,
  // reviews,
  colors,
  brand,
  className = "",
  slug,
  breadcrumb,
}: ProductCardProps) => {
  // const renderStars = (rating: number) => {
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 !== 0;

  //   return (
  //     <div className="flex items-center text-yellow-400">
  //       {[...Array(fullStars)].map((_, i) => (
  //         <span key={i} className="text-sm">
  //           ★
  //         </span>
  //       ))}
  //       {hasHalfStar && <span className="text-sm">☆</span>}
  //     </div>
  //   );
  // };

  const renderColorOptions = (colors: string[]) => (
    <div className="flex gap-1 mt-2">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-3 h-3 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
          style={{
            backgroundColor:
              color === "black" ? "#000" : color === "gray" ? "#6B7280" : color,
          }}
        />
      ))}
    </div>
  );

  const formatPrice = (price: string | number | undefined) => {
    if (price === undefined || price === null) return "";
    const numericPrice = Number(price);
    if (!isNaN(numericPrice)) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numericPrice);
    }
    return price.toString();
  };

  const CardContent = (
    <div
      className={`group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {badge && (
          <Badge
            className="absolute top-3 right-3 text-white font-bold"
            style={{ backgroundColor: badge.display_color }}
          >
            {badge.display_text}
          </Badge>
        )}
      </div>

      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">
          {brand}
        </p>

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Color Options */}
        {colors && renderColorOptions(colors)}

        <div className="flex items-center justify-between mt-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {salePrice ? (
              <>
                <span className="text-base font-bold text-red-600">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {/* Cart Button
          <button
            className="p-2 rounded-full bg-gray-50 text-gray-900 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
            onClick={handleAddToCart}
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
          </button> */}
        </div>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link to={`/products/${slug}`} state={{ breadcrumb }}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default ProductCard;
