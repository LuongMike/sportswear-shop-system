import React from "react";
import type { useProductDetail } from "@/hooks/useProductDetail";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";

type ProductDetailProps = ReturnType<typeof useProductDetail>;

const ProductDetail = (props: ProductDetailProps) => {
  const { product, currentVariant } = props;

  if (!product) return null;

  // Use images from current variant, or fallback to first variant's images
  const images =
    currentVariant?.imageUrls || product.variants[0]?.imageUrls || [];

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery
          key={currentVariant?.id || product.variants[0]?.id}
          images={images}
          productName={product.name}
        />
        <ProductInfo {...props} />
      </div>

      <div className="p-8"></div>

      <ProductTabs product={product} />
    </div>
  );
};

export default ProductDetail;
