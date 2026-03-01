// pages/ProductDetailPage.tsx
import { useParams } from "react-router";
import { useProductDetail } from "@/hooks/useProductDetail";
import ProductDetail from "@/components/product-detail/ProductDetail";
import Container from "@/components/ui/Container";

const ProductDetailPage = () => {
  const { slug } = useParams();

  // Lấy toàn bộ các trạng thái từ hook
  const { product, loading, error } = useProductDetail(slug);
  const productDetail = useProductDetail(slug);

  console.log("ProductDetailPage - product:", product);

  return (
    <div className="min-h-screen bg-white">
      <Container>
        {/* Truyền đủ 3 props để sửa lỗi TS(2739) */}
        <ProductDetail {...productDetail} loading={loading} error={error} />
      </Container>
    </div>
  );
};

export default ProductDetailPage;
