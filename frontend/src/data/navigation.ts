import type { NavigationCategory, NavigationSection } from "@/types/navigation";

// Main navigation categories
export const mainCategories: NavigationCategory[] = [
  { title: "New", href: "/collections/hang-moi" },
  { title: "Nam", href: "/collections/nam", hasDropdown: true },
  { title: "Nữ", href: "/collections/nu", hasDropdown: true },
  { title: "Trẻ Em", href: "/collections/tre-em", hasDropdown: true },
  { title: "Thương Hiệu", href: "/brands", hasDropdown: true },
  { title: "Bộ Sưu Tập", href: "/collections/bo-suu-tap", hasDropdown: true },
  { title: "Thể Thao", href: "/sports", hasDropdown: true },
  { title: "Black Friday", href: "/collections/black-friday", isSpecial: true },
];

// Men's categories
export const menCategories: NavigationSection[] = [
  {
    title: "GIÀY",
    items: [
      { name: "Giày Chạy Bộ", href: "/collections/nam/giay/chay-bo" },
      { name: "Giày Tập Luyện", href: "/collections/nam/giay/tap-luyen" },
      { name: "Giày Bóng Đá", href: "/collections/nam/giay/bong-da" },
      { name: "Giày Bóng Rổ", href: "/collections/nam/giay/bong-ro" },
      { name: "Giày Motorsport", href: "/collections/nam/giay/motorsport" },
      { name: "Giày Golf", href: "/collections/nam/giay/golf" },
      { name: "Sneakers", href: "/collections/nam/giay/sneakers" },
      { name: "Dép & Sandals", href: "/collections/nam/giay/dep-sandals" },
      {
        name: "Tất Cả Giày Nam",
        href: "/collections/nam/giay",
        featured: true,
      },
    ],
  },
  {
    title: "QUẦN ÁO",
    items: [
      { name: "Áo Khoác", href: "/collections/nam/quan-ao/ao-khoac" },
      { name: "Áo Thun & Tank Top", href: "/collections/nam/quan-ao/ao-thun" },
      { name: "Áo Polo", href: "/collections/nam/quan-ao/ao-polo" },
      { name: "Áo Jersey", href: "/collections/nam/quan-ao/ao-jersey" },
      { name: "Áo Ni & Hoodie", href: "/collections/nam/quan-ao/ao-ni-hoodie" },
      { name: "Quần Dài", href: "/collections/nam/quan-ao/quan-dai" },
      { name: "Quần Ngắn", href: "/collections/nam/quan-ao/quan-ngan" },
      { name: "Đồ Bơi", href: "/collections/nam/quan-ao/do-boi" },
      {
        name: "Tất Cả Quần Áo Nam",
        href: "/collections/nam/quan-ao",
        featured: true,
      },
    ],
  },
  {
    title: "PHỤ KIỆN",
    items: [
      { name: "Túi & Balo", href: "/collections/nam/phu-kien/tui-balo" },
      { name: "Mũ & Nón", href: "/collections/nam/phu-kien/mu-non" },
      { name: "Găng Tay", href: "/collections/nam/phu-kien/gang-tay" },
      { name: "Thắt Lưng", href: "/collections/nam/phu-kien/that-lung" },
      { name: "Tất & Vớ", href: "/collections/nam/phu-kien/tat-vo" },
      { name: "Phụ Kiện Thể Thao", href: "/collections/nam/phu-kien/the-thao" },
      {
        name: "Tất Cả Phụ Kiện Nam",
        href: "/collections/nam/phu-kien",
        featured: true,
      },
    ],
  },
];

// Women's categories
export const womenCategories: NavigationSection[] = [
  {
    title: "GIÀY",
    items: [
      { name: "Giày Chạy Bộ", href: "/collections/nu/giay/chay-bo" },
      { name: "Giày Tập Luyện", href: "/collections/nu/giay/tap-luyen" },
      { name: "Giày Bóng Đá", href: "/collections/nu/giay/bong-da" },
      { name: "Giày Bóng Rổ", href: "/collections/nu/giay/bong-ro" },
      { name: "Giày Motorsport", href: "/collections/nu/giay/motorsport" },
      { name: "Sneakers", href: "/collections/nu/giay/sneakers" },
      { name: "Dép & Sandals", href: "/collections/nu/giay/dep-sandals" },
      { name: "Tất Cả Giày Nữ", href: "/collections/nu/giay", featured: true },
    ],
  },
  {
    title: "QUẦN ÁO",
    items: [
      { name: "Áo Khoác", href: "/collections/nu/quan-ao/ao-khoac" },
      { name: "Áo Thun & Tank Top", href: "/collections/nu/quan-ao/ao-thun" },
      { name: "Áo Polo", href: "/collections/nu/quan-ao/ao-polo" },
      { name: "Áo Ni & Hoodie", href: "/collections/nu/quan-ao/ao-ni-hoodie" },
      { name: "Quần Dài", href: "/collections/nu/quan-ao/quan-dai" },
      { name: "Quần Ngắn", href: "/collections/nu/quan-ao/quan-ngan" },
      { name: "Đồ Bơi", href: "/collections/nu/quan-ao/do-boi" },
      {
        name: "Áo Ngực Thể Thao",
        href: "/collections/nu/quan-ao/ao-nguc-the-thao",
      },
      {
        name: "Tất Cả Quần Áo Nữ",
        href: "/collections/nu/quan-ao",
        featured: true,
      },
    ],
  },
  {
    title: "PHỤ KIỆN",
    items: [
      { name: "Túi & Balo", href: "/collections/nu/phu-kien/tui-balo" },
      { name: "Mũ & Nón", href: "/collections/nu/phu-kien/mu-non" },
      { name: "Tất & Vớ", href: "/collections/nu/phu-kien/tat-vo" },
      { name: "Phụ Kiện Thể Thao", href: "/collections/nu/phu-kien/the-thao" },
      { name: "Trang Sức", href: "/collections/nu/phu-kien/trang-suc" },
      {
        name: "Tất Cả Phụ Kiện Nữ",
        href: "/collections/nu/phu-kien",
        featured: true,
      },
    ],
  },
];

// Kids categories
export const kidsCategories: NavigationSection[] = [
  {
    title: "GIÀY TRẺ EM",
    items: [
      { name: "Giày Thể Thao", href: "/collections/tre-em/giay/the-thao" },
      { name: "Giày Chạy Bộ", href: "/collections/tre-em/giay/chay-bo" },
      { name: "Sneakers", href: "/collections/tre-em/giay/sneakers" },
      { name: "Dép & Sandals", href: "/collections/tre-em/giay/dep-sandals" },
      {
        name: "Tất Cả Giày Trẻ Em",
        href: "/collections/tre-em/giay",
        featured: true,
      },
    ],
  },
  {
    title: "QUẦN ÁO TRẺ EM",
    items: [
      { name: "Áo Khoác", href: "/collections/tre-em/quan-ao/ao-khoac" },
      { name: "Áo Thun", href: "/collections/tre-em/quan-ao/ao-thun" },
      { name: "Quần Dài", href: "/collections/tre-em/quan-ao/quan-dai" },
      { name: "Quần Ngắn", href: "/collections/tre-em/quan-ao/quan-ngan" },
      { name: "Đồ Bơi", href: "/collections/tre-em/quan-ao/do-boi" },
      {
        name: "Tất Cả Quần Áo Trẻ Em",
        href: "/collections/tre-em/quan-ao",
        featured: true,
      },
    ],
  },
  {
    title: "PHỤ KIỆN TRẺ EM",
    items: [
      { name: "Balo Trẻ Em", href: "/collections/tre-em/phu-kien/balo" },
      { name: "Mũ & Nón", href: "/collections/tre-em/phu-kien/mu-non" },
      { name: "Tất & Vớ", href: "/collections/tre-em/phu-kien/tat-vo" },
      {
        name: "Tất Cả Phụ Kiện Trẻ Em",
        href: "/collections/tre-em/phu-kien",
        featured: true,
      },
    ],
  },
];

// Sports categories
export const sportsCategories: NavigationSection[] = [
  {
    title: "MÔN THỂ THAO PHỔ BIẾN",
    items: [
      { name: "Bóng Đá", href: "/sports/bong-da" },
      { name: "Bóng Rổ", href: "/sports/bong-ro" },
      { name: "Chạy Bộ", href: "/sports/chay-bo" },
      { name: "Tennis", href: "/sports/tennis" },
      { name: "Golf", href: "/sports/golf" },
      { name: "Bơi Lội", href: "/sports/boi-loi" },
      { name: "Tập Gym", href: "/sports/tap-gym" },
      { name: "Yoga", href: "/sports/yoga" },
      { name: "Tất Cả Thể Thao", href: "/sports", featured: true },
    ],
  },
  {
    title: "THỂ THAO MẠNH",
    items: [
      { name: "Boxing", href: "/sports/boxing" },
      { name: "MMA", href: "/sports/mma" },
      { name: "Muay Thai", href: "/sports/muay-thai" },
      { name: "Cử Tạ", href: "/sports/cu-ta" },
      { name: "Crossfit", href: "/sports/crossfit" },
      { name: "Powerlifting", href: "/sports/powerlifting" },
    ],
  },
  {
    title: "THỂ THAO NGOÀI TRỜI",
    items: [
      { name: "Đạp Xe", href: "/sports/dap-xe" },
      { name: "Leo Núi", href: "/sports/leo-nui" },
      { name: "Cắm Trại", href: "/sports/cam-trai" },
      { name: "Hiking", href: "/sports/hiking" },
      { name: "Skateboarding", href: "/sports/skateboarding" },
      { name: "Lướt Sóng", href: "/sports/luot-song" },
    ],
  },
];

// Brands categories
export const brandsCategories: NavigationSection[] = [
  {
    title: "THƯƠNG HIỆU HÀNG ĐẦU",
    items: [
      { name: "Nike", href: "/brands/nike" },
      { name: "Adidas", href: "/brands/adidas" },
      { name: "Puma", href: "/brands/puma" },
      { name: "New Balance", href: "/brands/new-balance" },
      { name: "Converse", href: "/brands/converse" },
      { name: "Vans", href: "/brands/vans" },
      { name: "Under Armour", href: "/brands/under-armour" },
      { name: "Reebok", href: "/brands/reebok" },
      { name: "Xem Tất Cả Thương Hiệu", href: "/brands", featured: true },
    ],
  },
  {
    title: "THƯƠNG HIỆU LUXURY",
    items: [
      { name: "Balenciaga", href: "/brands/balenciaga" },
      { name: "Gucci", href: "/brands/gucci" },
      { name: "Louis Vuitton", href: "/brands/louis-vuitton" },
      { name: "Dior", href: "/brands/dior" },
      { name: "Versace", href: "/brands/versace" },
      { name: "Saint Laurent", href: "/brands/saint-laurent" },
    ],
  },
  {
    title: "THƯƠNG HIỆU STREETWEAR",
    items: [
      { name: "Supreme", href: "/brands/supreme" },
      { name: "Anti Social Social Club", href: "/brands/assc" },
      { name: "BAPE", href: "/brands/bape" },
      { name: "Stussy", href: "/brands/stussy" },
      { name: "Fear of God", href: "/brands/fear-of-god" },
      { name: "Palace", href: "/brands/palace" },
    ],
  },
];

// Collections categories
export const collectionsCategories: NavigationSection[] = [
  {
    title: "BỘ SƯU TẬP THƯƠNG HIỆU",
    items: [
      { name: "PUMA x Ferrari", href: "/collections/puma-x-ferrari" },
      { name: "PUMA x BMW", href: "/collections/puma-x-bmw" },
      { name: "Nike x Jordan", href: "/collections/nike-x-jordan" },
      { name: "Adidas x Yeezy", href: "/collections/adidas-x-yeezy" },
      { name: "Supreme x Nike", href: "/collections/supreme-x-nike" },
      { name: "Off-White x Nike", href: "/collections/off-white-x-nike" },
    ],
  },
  {
    title: "BỘ SƯU TẬP MÙA",
    items: [
      { name: "Thu Đông 2024", href: "/collections/thu-dong-2024" },
      { name: "Xuân Hè 2024", href: "/collections/xuan-he-2024" },
      { name: "Limited Edition", href: "/collections/limited-edition" },
      { name: "Retro Collection", href: "/collections/retro-collection" },
      { name: "Heritage Series", href: "/collections/heritage-series" },
    ],
  },
  {
    title: "BỘ SƯU TẬP ĐẶC BIỆT",
    items: [
      {
        name: "Black Friday Special",
        href: "/collections/black-friday-special",
      },
      { name: "New Year Collection", href: "/collections/new-year" },
      { name: "Valentine Collection", href: "/collections/valentine" },
      { name: "Summer Vibes", href: "/collections/summer-vibes" },
      { name: "Street Style", href: "/collections/street-style" },
      { name: "Tất Cả Bộ Sưu Tập", href: "/collections", featured: true },
    ],
  },
];

// Helper function to get dropdown content
export const getDropdownContent = (
  categoryTitle: string
): NavigationSection[] => {
  switch (categoryTitle) {
    case "Nam":
      return menCategories;
    case "Nữ":
      return womenCategories;
    case "Trẻ Em":
      return kidsCategories;
    case "Thương Hiệu":
      return brandsCategories;
    case "Thể Thao":
      return sportsCategories;
    case "Bộ Sưu Tập":
      return collectionsCategories;
    default:
      return [];
  }
};
