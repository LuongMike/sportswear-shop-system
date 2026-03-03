import type { ProductFilters as APIProductFilters } from "@/services/productsApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { useBrands } from "@/hooks/useBrandsQuery";
import { useState } from "react";

interface ProductFiltersProps {
  filters: APIProductFilters;
  onFiltersChange: (filters: APIProductFilters) => void;
}

const PRICE_RANGES = [
  { id: "p0", label: "Tất cả giá", min: undefined, max: undefined },
  { id: "p1", label: "Dưới 500.000đ", min: 0, max: 500000 },
  { id: "p2", label: "500.000đ - 1.000.000đ", min: 500000, max: 1000000 },
  { id: "p3", label: "1.000.000đ - 2.000.000đ", min: 1000000, max: 2000000 },
  { id: "p4", label: "Trên 2.000.000đ", min: 2000000, max: undefined },
];

const COLORS = [
  { name: "Đen", hex: "#222222" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Xám", hex: "#888888" },
  { name: "Xanh", hex: "#2196F3" },
  { name: "Xanh dương", hex: "#1E88E5" },
  { name: "Xanh lá", hex: "#4CAF50" },
  { name: "Đỏ", hex: "#E53935" },
  { name: "Vàng", hex: "#FFC107" },
  { name: "Nâu", hex: "#795548" },
  { name: "Hồng", hex: "#E91E63" },
  { name: "Cam", hex: "#FF9800" },
  { name: "Tím", hex: "#9C27B0" },
];

const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const { data: brandData, isLoading: isLoadingBrands } = useBrands();
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const brands = brandData?.data?.brands || [];

  const handleBrandChange = (brandId: number) => {
    if (filters.brandId === brandId) {
      onFiltersChange({ ...filters, brandId: undefined });
    } else {
      onFiltersChange({ ...filters, brandId });
    }
  };

  const handlePriceChange = (min?: number, max?: number) => {
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFiltersChange({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleColorChange = (colorName: string) => {
    if (filters.color === colorName) {
      onFiltersChange({ ...filters, color: undefined });
    } else {
      onFiltersChange({ ...filters, color: colorName });
    }
  };

  const clearAllFilters = () => {
    setSearchInput("");
    onFiltersChange({
      search: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      brandId: undefined,
      color: undefined,
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.brandId ||
    filters.color
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ lọc
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Tìm kiếm</h4>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tên sản phẩm..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          <Button onClick={handleSearch} size="sm" className="px-3">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {filters.search && (
          <p className="text-xs text-blue-600 mt-1">
            Đang tìm: "{filters.search}"
          </p>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Khoảng giá</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const isSelected =
              filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={range.id}
                  checked={isSelected}
                  onCheckedChange={() =>
                    handlePriceChange(range.min, range.max)
                  }
                />
                <Label
                  htmlFor={range.id}
                  className={`text-sm cursor-pointer ${isSelected ? "font-medium text-blue-600" : "font-normal"}`}
                >
                  {range.label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Thương hiệu</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {isLoadingBrands ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))
          ) : brands.length === 0 ? (
            <p className="text-sm text-gray-500">Không có thương hiệu</p>
          ) : (
            brands.map((brand) => {
              const isSelected = filters.brandId === brand.id;
              return (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={isSelected}
                    onCheckedChange={() => handleBrandChange(brand.id)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className={`text-sm cursor-pointer ${isSelected ? "font-medium text-blue-600" : "font-normal"}`}
                  >
                    {brand.brandName}
                  </Label>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Màu sắc</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const isSelected = filters.color === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorChange(color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-blue-500 border-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            );
          })}
        </div>
        {filters.color && (
          <p className="text-xs text-blue-600 mt-2">Đã chọn: {filters.color}</p>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Đang lọc:</p>
          <div className="flex flex-wrap gap-1">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Tìm: {filters.search}
                <button
                  onClick={() => {
                    setSearchInput("");
                    onFiltersChange({ ...filters, search: undefined });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.minPrice !== undefined ||
              filters.maxPrice !== undefined) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Giá: {filters.minPrice?.toLocaleString() || 0}đ -{" "}
                {filters.maxPrice?.toLocaleString() || "∞"}đ
                <button
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      minPrice: undefined,
                      maxPrice: undefined,
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.brandId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {brands.find((b) => b.id === filters.brandId)?.name ||
                  "Thương hiệu"}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, brandId: undefined })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                <span
                  className="w-3 h-3 rounded-full border border-pink-300"
                  style={{
                    backgroundColor:
                      COLORS.find((c) => c.name === filters.color)?.hex ||
                      "#ccc",
                  }}
                />
                {filters.color}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, color: undefined })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
