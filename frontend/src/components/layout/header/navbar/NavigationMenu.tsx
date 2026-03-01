import { Link, useNavigate } from "react-router";
import {
  NavigationMenu as ShadcnNavMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useNavigation } from "@/hooks/useNavigationQuery";
import { Skeleton } from "@/components/ui/skeleton";

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { data: navigationData, isLoading, error } = useNavigation();

  const createSlugFromName = (name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  // LOGIC QUAN TRỌNG: Tạo URL kèm ID để useProductPageLogic có thể đọc
  const getLinkHref = (navItem: any, item: any) => {
    const parentName = navItem.categoryName.toLowerCase();
    if (parentName.includes("thương hiệu"))
      return `/collections?brandId=${item.id}`;
    if (parentName.includes("thể thao"))
      return `/collections?sportId=${item.id}`;
    return `/collections?categoryId=${item.id}`;
  };

  const getParentHref = (navItem: any) =>
    `/collections?categoryId=${navItem.id}`;

  // --- GIỮ NGUYÊN PHẦN HIỂN THỊ (HTML/UI) ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full">
        <p className="text-red-500 text-sm">Không thể tải menu navigation</p>
      </div>
    );
  }

  if (!navigationData || !Array.isArray(navigationData)) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <ShadcnNavMenu viewport={true} className="w-full">
        <NavigationMenuList className="flex items-center justify-center space-x-0">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                to="/collections"
                className="block px-4 py-6 text-lg font-medium text-black hover:text-red-500 transition-all duration-200"
              >
                Hàng Mới
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {navigationData.map((navItem) => (
            <NavigationMenuItem key={navItem.id} className="relative">
              {navItem.children && navItem.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger
                    className="h-auto px-4 cursor-pointer py-6 text-lg font-medium text-black bg-transparent hover:bg-transparent hover:text-red-500 transition-all duration-200 rounded-none"
                    onClick={() => navigate(getParentHref(navItem))}
                  >
                    {navItem.categoryName}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="w-full px-8 py-8 bg-white">
                      <div
                        className="grid gap-8 container mx-auto"
                        style={{
                          gridTemplateColumns: `repeat(${navItem.children.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {navItem.children.map((column: any) => (
                          <div key={column.id} className="space-y-4">
                            <h3 className="text-base font-bold text-black uppercase tracking-wider border-b border-gray-200 pb-2">
                              <NavigationMenuLink asChild>
                                <Link to={getLinkHref(navItem, column)}>
                                  {column.categoryName}
                                </Link>
                              </NavigationMenuLink>
                            </h3>

                            <ul className="space-y-2">
                              {column.children &&
                                column.children
                                  .filter(
                                    (item: any) =>
                                      !["Ưu Đãi", "Hàng Mới"].includes(
                                        item.categoryName,
                                      ),
                                  )
                                  .map((item: any) => (
                                    <li key={item.id}>
                                      <NavigationMenuLink asChild>
                                        <Link
                                          to={getLinkHref(navItem, item)}
                                          className="block text-sm text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                          {item.categoryName}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    to={getParentHref(navItem)}
                    className="block px-4 py-6 text-lg font-medium text-black hover:text-red-500 transition-all duration-200"
                  >
                    {navItem.categoryName}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </ShadcnNavMenu>
    </div>
  );
};

export default NavigationMenu;
