export type NavigationCategory = {
  title: string;
  href: string;
  hasDropdown?: boolean;
  isSpecial?: boolean; // ví dụ: Black Friday
};

export type NavigationItem = {
  name: string;
  href: string;
  featured?: boolean; // dùng để highlight / CTA
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

export interface NavigationRoot {
  id: number;
  name: string;
  slug: string;
  children?: {
    id: number;
    name: string;
    items: {
      id: number;
      name: string;
      slug: string;
    }[];
  }[];
}

export type NavigationStructure = NavigationRoot[];
