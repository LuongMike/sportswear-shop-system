import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import type { ProductFilters as APIProductFilters } from "@/services/productsApi";
import type { PageType } from "@/types/PageType";
import {
  generateBreadcrumbs,
  generatePageTitle,
} from "../utils/productPageUtils";

export const useProductPageLogic = () => {
  const { category, subcategory, subsubcategory, brand, sport } = useParams();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<APIProductFilters>({});
  const [sortBy, setSortBy] = useState("newest");

  // Get search query from URL
  const searchQuery = searchParams.get("q") || "";

  // Determine page type and build API filters
  const { pageType, apiFilters, serverFilters } = useMemo(() => {
    // Base filters for server (URL params)
    // We exclude sortBy from serverFilters to prevent refetching when sorting changes
    // Sorting will be handled client-side
    const baseServerFilters: APIProductFilters = {};

    // Base filters for client (UI state)
    const baseFilters: APIProductFilters = { ...filters, sort_by: sortBy };

    let result = {
      pageType: { type: "all", value: "all" } as PageType,
      apiFilters: baseFilters,
      serverFilters: baseServerFilters,
    };

    if (category && subcategory && subsubcategory) {
      result = {
        pageType: {
          type: "nested",
          category,
          subcategory,
          subsubcategory,
        } as PageType,
        apiFilters: { ...baseFilters, category: subsubcategory },
        serverFilters: { ...baseServerFilters, category: subsubcategory },
      };
    } else if (category && subcategory) {
      result = {
        pageType: { type: "subcategory", category, subcategory } as PageType,
        apiFilters: { ...baseFilters, category: subcategory },
        serverFilters: { ...baseServerFilters, category: subcategory },
      };
    } else if (category) {
      // Check for "new-arrivals"
      if (category === "new-arrivals") {
        result = {
          pageType: { type: "badge", value: "hang-moi" } as PageType,
          apiFilters: { ...baseFilters, badge: "hang-moi" },
          serverFilters: { ...baseServerFilters, badge: "hang-moi" },
        };
      }
      // Check if category is actually a gender
      else if (["nam", "nu", "tre-em"].includes(category)) {
        result = {
          pageType: { type: "gender", value: category } as PageType,
          apiFilters: { ...baseFilters, gender: category },
          serverFilters: { ...baseServerFilters, gender: category },
        };
      } else {
        result = {
          pageType: { type: "category", category } as PageType,
          apiFilters: { ...baseFilters, category },
          serverFilters: { ...baseServerFilters, category },
        };
      }
    } else if (brand) {
      result = {
        pageType: { type: "brand", value: brand } as PageType,
        apiFilters: { ...baseFilters, brand },
        serverFilters: { ...baseServerFilters, brand },
      };
    } else if (sport) {
      result = {
        pageType: { type: "sport", value: sport } as PageType,
        apiFilters: { ...baseFilters, sport },
        serverFilters: { ...baseServerFilters, sport },
      };
    } else if (searchQuery) {
      result = {
        pageType: { type: "search", value: searchQuery } as PageType,
        apiFilters: { ...baseFilters, search: searchQuery },
        serverFilters: { ...baseServerFilters, search: searchQuery },
      };
    }

    return result;
  }, [
    category,
    subcategory,
    subsubcategory,
    brand,
    sport,
    searchQuery,
    filters,
    sortBy,
  ]);

  const breadcrumbs = generateBreadcrumbs(
    pageType,
    category,
    subcategory,
    subsubcategory
  );
  const pageTitle = generatePageTitle(
    pageType,
    category,
    subcategory,
    subsubcategory
  );

  return {
    pageType,
    apiFilters,
    breadcrumbs,
    pageTitle,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    serverFilters, // Export serverFilters
  };
};
