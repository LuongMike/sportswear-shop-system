import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductSort from "@/components/products/ProductSort";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type {
  ProductFilters as APIProductFilters,
  ProductsResponse,
} from "@/services/productsApi";

interface ProductListingProps {
  title: string;
  breadcrumbItems: { label: string; href: string }[];
  filters: APIProductFilters;
  onFiltersChange: (filters: APIProductFilters) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  data: ProductsResponse | undefined;
  isLoading: boolean;
  error: unknown;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

const ProductListing = ({
  title,
  breadcrumbItems,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  data,
  isLoading,
  error,
  onPageChange,
  onRefetch,
}: ProductListingProps) => {
  // Generate pagination items
  const generatePaginationItems = () => {
    if (!data?.pagination) return [];

    const { page, totalPages } = data.pagination;
    const items = [];
    const delta = 2; // Show 2 pages before and after current page

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      items.push(i);
    }

    return items;
  };

  return (
    <>
      {/* Breadcrumb - Last item should not be a link */}
      <Breadcrumb
        items={breadcrumbItems.map((item, index) =>
          index === breadcrumbItems.length - 1 ? { ...item, href: "" } : item
        )}
      />

      {/* Page Header */}
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">
          {data?.pagination?.total || 0} sản phẩm
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 xl:w-72 shrink-0">
          <ProductFilters filters={filters} onFiltersChange={onFiltersChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort Options */}
          <ProductSort sortBy={sortBy} onSortChange={onSortChange} />

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-150"></div>
              </div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Có lỗi xảy ra khi tải sản phẩm</p>
              <button
                onClick={onRefetch}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {data?.data?.map((product, index) => (
                <ProductCard
                  key={product.id || index}
                  name={product.name}
                  slug={product.slug}
                  image={
                    product.mainImageUrl ||
                    "https://placehold.co/600x600?text=No+Image"
                  }
                  originalPrice={product.basePrice}
                  salePrice={undefined}
                  badge={product.badge}
                  rating={0}
                  brand={product.brandName || ""}
                  colors={product.colors}
                  breadcrumb={breadcrumbItems} // Truyền breadcrumb xuống
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination>
                <PaginationContent>
                  {data.pagination.page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(data.pagination.page - 1);
                        }}
                      />
                    </PaginationItem>
                  )}

                  {data.pagination.page > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(1);
                          }}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {data.pagination.page > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {generatePaginationItems().map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === data.pagination.page}
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {data.pagination.page < data.pagination.totalPages - 2 && (
                    <>
                      {data.pagination.page <
                        data.pagination.totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(data.pagination.totalPages);
                          }}
                        >
                          {data.pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  {data.pagination.page < data.pagination.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(data.pagination.page + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductListing;
