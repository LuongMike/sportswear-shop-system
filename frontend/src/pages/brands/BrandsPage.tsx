import { Link } from "react-router";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/useBrandsQuery";
import type { Brand } from "@/services/brandApi";

const BrandsPage = () => {
  const { data: response, isLoading, error } = useBrands();

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Thương hiệu", href: "" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase">
            Thương Hiệu
          </h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[3/2] w-full rounded-none"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">
              Có lỗi xảy ra khi tải danh sách thương hiệu
            </p>
          </div>
        )}

        {/* Brands Grid */}
        {!isLoading && !error && response?.data?.brands && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
            {response.data.brands.map((brand: Brand) => (
              <Link
                key={brand.id}
                to={`/collections?brand=${brand.slug}`}
                className="group block"
              >
                <div className="bg-[#f8f8f8] aspect-[4/2] flex items-center justify-center  hover:bg-gray-100 transition-colors duration-300">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-400 group-hover:text-gray-900 transition-colors text-center uppercase">
                      {brand.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BrandsPage;
