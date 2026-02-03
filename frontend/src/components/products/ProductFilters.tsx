import type { ProductFilters as APIProductFilters } from "@/services/productsApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useBrands } from "@/hooks/useBrandsQuery";
import { useColors } from "@/hooks/useColorsQuery";

interface ProductFiltersProps {
  filters: APIProductFilters;
  onFiltersChange: (filters: APIProductFilters) => void;
}

const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const { data: brandData, isLoading: isLoadingBrands } = useBrands();
  const { data: colorData, isLoading: isLoadingColors } = useColors();

  const brands = brandData?.data?.brands || [];
  const colors = colorData?.data || [];

  const handleBrandChange = (brandSlug: string) => {
    // Currently supporting single brand selection for simplicity,
    // but could be extended to multiple if API supports it
    if (filters.brand === brandSlug) {
      onFiltersChange({ ...filters, brand: undefined });
    } else {
      onFiltersChange({ ...filters, brand: brandSlug });
    }
  };

  const handleColorChange = (colorName: string) => {
    if (filters.color === colorName) {
      onFiltersChange({ ...filters, color: undefined });
    } else {
      onFiltersChange({ ...filters, color: colorName });
    }
  };

  const handlePriceChange = (min?: number, max?: number) => {
    // Toggle logic: if clicking the same range, clear it
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>

      {/* Search */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Tìm kiếm</h4>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-8"
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Khoảng giá</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="price-1"
              checked={filters.maxPrice === 500000}
              onCheckedChange={() => handlePriceChange(0, 500000)}
            />
            <Label
              htmlFor="price-1"
              className="text-sm font-normal cursor-pointer"
            >
              Dưới 500.000đ
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="price-2"
              checked={
                filters.minPrice === 500000 && filters.maxPrice === 1000000
              }
              onCheckedChange={() => handlePriceChange(500000, 1000000)}
            />
            <Label
              htmlFor="price-2"
              className="text-sm font-normal cursor-pointer"
            >
              500.000đ - 1.000.000đ
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="price-3"
              checked={filters.minPrice === 1000000 && !filters.maxPrice}
              onCheckedChange={() => handlePriceChange(1000000, undefined)}
            />
            <Label
              htmlFor="price-3"
              className="text-sm font-normal cursor-pointer"
            >
              Trên 1.000.000đ
            </Label>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Thương hiệu</h4>
        <div className="space-y-2">
          {isLoadingBrands
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))
            : brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={filters.brand === brand.slug}
                    onCheckedChange={() => handleBrandChange(brand.slug)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm font-normal cursor-pointer uppercase"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Màu sắc</h4>
        {isLoadingColors ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {colors.map((color: any) => (
              <div
                key={color.id}
                className={`w-8 h-8 rounded-full border cursor-pointer transition-all ${
                  filters.color === color.hexCode
                    ? "ring-2 ring-offset-2 ring-blue-500 border-blue-500"
                    : "border-gray-300 hover:scale-110"
                }`}
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
                onClick={() => handleColorChange(color.hexCode)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
