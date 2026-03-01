import { useState } from "react";
import { useProducts } from "@/hooks/useProductsQuery";
import { useProductPageLogic } from "@/hooks/useProductPageLogic";
import Container from "@/components/ui/Container";
import ProductListing from "@/components/products/ProductListing";

const ProductsPage = () => {
  const {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    breadcrumbs,
    pageTitle,
  } = useProductPageLogic();
  const [currentPage, setCurrentPage] = useState(1);

  // React Query gọi API với merged filters (URL + UI)
  const {
    data: productsResponse,
    isLoading,
    refetch,
  } = useProducts({
    filters,
    page: currentPage,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-white pt-4">
      <Container>
        <ProductListing
          title={pageTitle}
          breadcrumbItems={breadcrumbs}
          data={productsResponse}
          isLoading={isLoading}
          filters={filters}
          onFiltersChange={(f) => {
            setFilters(f);
            setCurrentPage(1);
          }}
            sortBy={sortBy}
            onSortChange={setSortBy}
          onPageChange={setCurrentPage}
          onRefetch={refetch}
          error={null}
        />
      </Container>
    </div>
  );
};

export default ProductsPage;
