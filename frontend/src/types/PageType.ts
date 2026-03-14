export type PageType =
  | {
      type: "nested";
      category: string;
      subcategory: string;
      subsubcategory: string;
    }
  | { type: "subcategory"; category: string; subcategory: string }
  | { type: "category"; category: string }
  | { type: "gender"; value: string }
  | { type: "brand"; value: string }
  | { type: "sport"; value: string }
  | { type: "badge"; value: string }
  | { type: "search"; value: string }
  | { type: "all"; value: "all" };
