import type { Brand } from "@/services/brandApi";
import { brandsCategories } from "./navigation";
import { logoBrand } from "./navigation";

/**
 * Lấy danh sách thương hiệu từ navigation data
 * Dùng làm fallback khi API brands không thành công
 */

const brandLogos: Record<string, string> = {
  nike: "https://th.bing.com/th/id/R.65138dbd196569257a0f3bf9db3345de?rik=wCS49hxUZn8%2fRw&pid=ImgRaw&r=0",
  adidas:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1280px-Adidas_Logo.svg.png",
  puma: "https://static.vecteezy.com/system/resources/previews/022/076/746/non_2x/puma-logo-and-art-free-vector.jpg",
  "new-balance":
    "https://images.seeklogo.com/logo-png/9/2/new-balance-logo-png_seeklogo-98723.png",
  converse:
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg",
  vans: "https://drake.vn/image/catalog/H%C3%ACnh%20content/logo-vans/vans-logo_2.jpg",
  "under-armour":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Under_armour_logo.svg/1280px-Under_armour_logo.svg.png",
  reebok:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Reebok_2019_logo.svg/1280px-Reebok_2019_logo.svg.png",

  // luxury
  balenciaga:
    "https://images.seeklogo.com/logo-png/36/1/balenciaga-logo-png_seeklogo-365962.png",
  gucci:
    "https://inkythuatso.com/uploads/thumbnails/800/2021/11/gucci-logo-inkythuatso-01-02-10-02-14.jpg",
  "louis-vuitton":
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Louis_Vuitton_logo_and_wordmark.svg",
  dior: "https://static.vecteezy.com/system/resources/thumbnails/023/599/265/small/dior-brand-luxury-clothes-logo-symbol-black-design-fashion-illustration-free-vector.jpg",
  versace:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyISi4AHNZ-ttDM0cq35WuVlgMPxt6YqqZBw&s",
  "saint-laurent":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA6M3rAJIlW-qF7jRr7kYu8GgmNOVUAScbcA&s",

  // streetwear
  supreme:
    "https://inkythuatso.com/uploads/thumbnails/800/2021/12/supreme-logo-inkythuatso-2-01-07-10-55-35.jpg",
  assc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZmUISWUFkJDpa1hoM4loSRhp19Zn62yWkA&s",
  bape: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRelPBYphxnsXBdrfOJtNawS8FmeyNYUYtshQ&s",
  stussy:
    "https://images.seeklogo.com/logo-png/13/2/stussy-logo-png_seeklogo-133101.png",
  "fear-of-god":
    "https://m.media-amazon.com/images/I/31ulsaoKerL._AC_UF894,1000_QL80_.jpg",
  palace:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCIHmVj06TbT_6JIGOSeQf6rZW-nJr8fskeA&s",
};

function getBrandsFromNavigation(): Brand[] {
  const seen = new Set<string>();
  const brands: Brand[] = [];
  let id = 1;

  for (const section of brandsCategories) {
    for (const item of section.items) {
      if (item.name === "Xem Tất Cả Thương Hiệu" || item.href === "/brands")
        continue;

      const slug = item.href.replace("/brands/", "");
      if (seen.has(slug)) continue;
      seen.add(slug);

      brands.push({
        id: id++,
        name: item.name,
        slug,
        logo: brandLogos[slug] ?? logoBrand.src, // ✅ LOGIC CHÍNH
        description: null,
        banner: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return brands;
}

export const fallbackBrands: Brand[] = getBrandsFromNavigation();

export const fallbackBrandsResponse = {
  data: {
    brands: fallbackBrands,
    count: fallbackBrands.length,
  },
};
