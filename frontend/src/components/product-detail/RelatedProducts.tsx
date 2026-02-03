import React from "react";
import { useProducts } from "@/hooks/useProductsQuery";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductDetailResponse } from "@/types/api";

interface RelatedProductsProps {
  product: ProductDetailResponse;
}

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  // Strategy: Fetch products from the same category
  const categorySlug = product.categories?.[0]?.slug;

  const { data, isLoading } = useProducts({
    filters: {
      category: categorySlug,
    },
    limit: 5, // Fetch 5, filter 1 = 4 displayed
    enabled: !!categorySlug,
  });

  // Filter out the current product
  const relatedProducts =
    data?.data.filter((p) => p.id !== product.id).slice(0, 4) || [];

  if (isLoading) return null;
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 mb-8">
      <h2 className="text-2xl font-bold mb-6">Bạn có thể thích</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((item) => (
          <ProductCard
            key={item.id}
            name={item.name}
            image={item.mainImageUrl || ""}
            originalPrice={item.basePrice}
            brand={item.brandName || ""}
            colors={item.colors}
            slug={item.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
