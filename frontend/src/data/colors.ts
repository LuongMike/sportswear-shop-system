import type { Color } from "@/services/colorApi";

/**
 * Danh sách màu fallback khi API colors không thành công
 */
export const fallbackColors: Color[] = [
  { id: 1, name: "Đen", hexCode: "#000000" },
  { id: 2, name: "Trắng", hexCode: "#FFFFFF" },
  { id: 3, name: "Đỏ", hexCode: "#DC2626" },
  { id: 4, name: "Xanh navy", hexCode: "#1E3A5F" },
  { id: 5, name: "Xanh dương", hexCode: "#2563EB" },
  { id: 6, name: "Xanh lá", hexCode: "#16A34A" },
  { id: 7, name: "Xám", hexCode: "#6B7280" },
  { id: 8, name: "Be", hexCode: "#D4B896" },
  { id: 9, name: "Hồng", hexCode: "#EC4899" },
  { id: 10, name: "Vàng", hexCode: "#EAB308" },
];

export const fallbackColorsResponse = {
  success: true,
  data: fallbackColors,
};
