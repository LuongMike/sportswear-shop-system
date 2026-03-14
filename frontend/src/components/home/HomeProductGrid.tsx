import ProductCard from "@/components/ui/ProductCard";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  productName: string;
  brandName: string;
  categoryName: string;
  sportName: string;
}

const HomeProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8083/api/products");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("API products:", data);

        // 🔑 QUAN TRỌNG: đảm bảo là mảng
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data); // nếu backend trả { data: [...] }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Fetch products failed:", err);
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Đang tải sản phẩm...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có sản phẩm nào</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.productName}
              slug={`product-${product.id}`}
              brand={product.brandName}
              image="https://placehold.co/600x600?text=Product"
              originalPrice={0}
              salePrice={undefined}
              badge={undefined}
              rating={0}
              colors={[]}
              breadcrumb={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeProductGrid;
