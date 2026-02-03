import { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import ProductListing from "@/components/products/ProductListing";
import { useProducts } from "@/hooks/useProductsQuery";
import { useProductPageLogic } from "../../hooks/useProductPageLogic";
// import type { ProductSummary } from "@/types/api";

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const {
    // apiFilters,
    serverFilters,
    breadcrumbs,
    pageTitle,
    filters,
    setFilters,
    sortBy,
    setSortBy,
  } = useProductPageLogic();

  // Fetch ALL products for the current context (Category/Brand/Sport)
  // We use serverFilters (URL params) instead of apiFilters (which includes UI filters)
  // Set a high limit to get "all" products for client-side filtering
  const {
    data: allData,
    isLoading,
    error,
    refetch,
  } = useProducts({
    filters: serverFilters,
    page: 1,
    limit: 1000, // Fetch up to 1000 items for client-side filtering
  });

  // Client-side Filtering & Pagination
  const filteredData = useMemo(() => {
    if (!allData?.data)
      return {
        success: true,
        data: [],
        pagination: { total: 0, page: 1, limit, totalPages: 0 },
      };

    let result = [...allData.data];

    // 1. Filter by Brand (if selected in UI)
    if (filters.brand) {
      result = result.filter(
        (p) =>
          p.brandName?.toLowerCase() === filters.brand?.toLowerCase() ||
          p.slug.includes(filters.brand?.toLowerCase() || "")
      );
    }

    // 2. Filter by Color
    if (filters.color) {
      result = result.filter((p) =>
        p.colors?.some((c) => c.toLowerCase() === filters.color?.toLowerCase())
      );
    }

    // 3. Filter by Price
    if (filters.minPrice !== undefined) {
      result = result.filter(
        (p) => Number(p.basePrice) >= (filters.minPrice || 0)
      );
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(
        (p) => Number(p.basePrice) <= (filters.maxPrice || Infinity)
      );
    }

    // 4. Filter by Search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(searchLower));
    }

    // 5. Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    }
    // "newest" is usually default from API, but we can re-sort if needed
    // if (sortBy === "newest") ...

    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (currentPage - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginatedData,
      pagination: {
        total,
        page: currentPage,
        limit,
        totalPages,
      },
    };
  }, [allData, filters, sortBy, currentPage]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <ProductListing
          title={pageTitle}
          breadcrumbItems={breadcrumbs}
          filters={filters}
          onFiltersChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1); // Reset to page 1 on filter change
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          data={filteredData}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          onRefetch={refetch}
        />
      </Container>
    </div>
  );
};

export default ProductsPage;
