import { useParams, useLocation } from "react-router";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useProductDetail } from "@/hooks/useProductDetail";
import { getBreadcrumb } from "@/utils/breadCrumbUtils";
import ProductDetail from "@/components/product-detail/ProductDetail";
import RelatedProducts from "@/components/product-detail/RelatedProducts";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();

  const productDetailData = useProductDetail(slug);
  const { product, loading, error } = productDetailData;

  // Lấy breadcrumb từ state (nếu có)
  const breadcrumbFromState = location.state?.breadcrumb;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-8 text-center">Đang tải sản phẩm...</div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-8 text-center text-red-600">
            {error || "Không tìm thấy sản phẩm"}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <Breadcrumb items={getBreadcrumb(breadcrumbFromState, product)} />

        {/* Product Detail Content */}
        <ProductDetail {...productDetailData} />

        {/* Related Products */}
        {product && <RelatedProducts product={product} />}
      </Container>
    </div>
  );
};

export default ProductDetailPage;
