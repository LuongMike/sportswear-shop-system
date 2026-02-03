import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";

import {
  NavigationMenu as ShadcnNavMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import { Skeleton } from "@/components/ui/skeleton";
import { useNavigation } from "@/hooks/useNavigationQuery";

import type { NavigationRoot } from "@/types/api";
import { NAVIGATION_TYPE } from "@/types/api";
import { mainCategories, getDropdownContent } from "@/data/navigation";

/* =====================
   UI STATES
===================== */
const SkeletonNav = () => (
  <div className="flex items-center justify-center w-full">
    <div className="flex space-x-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24" />
      ))}
    </div>
  </div>
);

const ErrorNav = () => (
  <div className="flex items-center justify-center w-full">
    <p className="text-sm text-red-500">Không thể tải menu navigation</p>
  </div>
);

/* =====================
   COMPONENT
===================== */
const NavigationMenu = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useNavigation();

  let navigationData: NavigationRoot[] = response?.data ?? [];
  const useFallback = navigationData.length === 0 || !!error;

  if (useFallback) {
    navigationData = mainCategories
      .filter((c) => c.title !== "New") // "Hàng Mới" đã render static bên dưới
      .map((category) => {
        const slugMap: { [key: string]: string } = {
          Nam: "nam",
          Nữ: "nu",
          "Trẻ Em": "tre-em",
          "Thương Hiệu": "thuong-hieu",
          "Thể Thao": "the-thao",
          "Bộ Sưu Tập": "bo-suu-tap",
          "Black Friday": "black-friday",
        };
        const slug = slugMap[category.title] || "";

        const children = getDropdownContent(category.title).map((section) => {
          const sectionItems = section.items.map((item) => {
            const itemSlug = item.href.split("/").pop() || "";
            return {
              id: item.name,
              name: item.name,
              slug: itemSlug,
              href: item.href, // Giữ href gốc để dùng đúng URL từ data
            };
          });

          return {
            id: section.title,
            name: section.title,
            items: sectionItems,
          };
        });

        let type: (typeof NAVIGATION_TYPE)[keyof typeof NAVIGATION_TYPE] =
          NAVIGATION_TYPE.CATEGORY;
        if (["Nam", "Nữ", "Trẻ Em"].includes(category.title)) {
          type = NAVIGATION_TYPE.GENDER;
        }

        return {
          id: category.title,
          name: category.title,
          slug: slug,
          type: type,
          children: children,
          parentHref: category.href, // Giữ href gốc cho "Xem tất cả" và link cha
        };
      });
  }

  /* =====================
     HOOKS (PHẢI Ở TRÊN)
  ===================== */
  const getLinkHref = useCallback((parentSlug: string, itemSlug: string) => {
    if (parentSlug === "thuong-hieu") return `/brands/${itemSlug}`;
    if (parentSlug === "the-thao") return `/sports/${itemSlug}`;
    return `/collections/${parentSlug}/${itemSlug}`;
  }, []);

  const getParentHref = useCallback((slug: string) => {
    if (slug === "thuong-hieu") return "/brands";
    if (slug === "the-thao") return "/sports";
    return `/collections/${slug}`;
  }, []);

  /* =====================
     EARLY RETURNS
  ===================== */
  if (isLoading) return <SkeletonNav />;
  if (error && navigationData.length === 0) return <ErrorNav />;
  if (navigationData.length === 0 || !navigationData) return null;

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="flex items-center justify-center w-full">
      <ShadcnNavMenu viewport className="w-full">
        <NavigationMenuList className="flex items-center justify-center space-x-0">
          {/* Static item */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/collections/new-arrivals"
                className="block px-4 py-6 text-lg font-medium text-black hover:text-red-500 transition-colors"
              >
                Hàng Mới
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Dynamic items */}
          {navigationData.map((navItem) => {
            const children = navItem.children;

            // ===== No dropdown =====
            if (!children || children.length === 0) {
              const to = navItem.parentHref ?? getParentHref(navItem.slug);
              return (
                <NavigationMenuItem key={navItem.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={to}
                      className="block px-4 py-6 text-lg font-medium text-black hover:text-red-500 transition-colors"
                    >
                      {navItem.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            // ===== With dropdown =====
            return (
              <NavigationMenuItem key={navItem.id} className="relative">
                <NavigationMenuTrigger className="h-auto px-4 py-6 text-lg font-medium text-black hover:text-red-500 bg-transparent rounded-none">
                  {navItem.name}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="w-full px-4 sm:px-6 md:px-8 py-8 bg-white">
                    <div
                      className="grid gap-8 max-w-[1600px] mx-auto"
                      style={{
                        gridTemplateColumns: `repeat(${children.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {children.map((column) => (
                        <div key={column.id} className="space-y-4">
                          {/* Level 2 */}
                          <h3 className="text-base font-bold uppercase tracking-wide border-b border-gray-200 pb-2">
                            {column.name}
                          </h3>

                          {/* Level 3 */}
                          <ul className="space-y-2">
                            {column.items
                              .filter(
                                (item) =>
                                  !["Ưu Đãi", "Hàng Mới"].includes(item.name),
                              )
                              .map((item) => (
                                <li key={item.id}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to={
                                        item.href ??
                                        getLinkHref(navItem.slug, item.slug)
                                      }
                                      className="block text-sm text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                      {item.name}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Parent link */}
                    <div className="mt-6 text-right">
                      <button
                        onClick={() =>
                          navigate(
                            navItem.parentHref ?? getParentHref(navItem.slug)
                          )
                        }
                        className="text-sm font-medium text-black hover:text-red-500"
                      >
                        Xem tất cả →
                      </button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </ShadcnNavMenu>
    </div>
  );
};

export default NavigationMenu;
