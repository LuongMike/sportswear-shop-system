import type { Order } from "@/services/orderApi";

export const MOCK_ADMIN_ORDERS: Order[] = [
  {
    orderId: 1,
    orderCode: "ORD-20250210-001",
    orderDate: new Date().toISOString(),
    status: "COMPLETED",
    totalFinalAmount: 1250000,
    customerName: "Nguyễn Văn A",
    shippingAddress: "123 Lý Thường Kiệt, Q.10, TP.HCM",
    items: [
      {
        quantity: 1,
        price: 750000,
        productName: "Áo đá bóng CLB sân nhà",
        variantDetails: "Size M / Xanh",
        mainImageUrl: null,
      },
      {
        quantity: 1,
        price: 500000,
        productName: "Quần short thể thao",
        variantDetails: "Size M / Đen",
        mainImageUrl: null,
      },
    ],
    customerPhone: 84901234567,
    shipperName: "Ship Nhanh 247",
    shipperPhone: "19001234" as unknown as number,
    paymentMethod: "bank",
  },
  {
    orderId: 2,
    orderCode: "ORD-20250209-002",
    orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    totalFinalAmount: 890000,
    customerName: "Trần Thị B",
    shippingAddress: "45 Nguyễn Huệ, Q.1, TP.HCM",
    items: [
      {
        quantity: 1,
        price: 890000,
        productName: "Giày chạy bộ Pro Run",
        variantDetails: "Size 40 / Trắng",
        mainImageUrl: null,
      },
    ],
    customerPhone: 84901112233,
    shipperName: "Đang gán shipper",
    shipperPhone: "0" as unknown as number,
    paymentMethod: "cod",
  },
  {
    orderId: 3,
    orderCode: "ORD-20250208-003",
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "CANCELLED",
    totalFinalAmount: 560000,
    customerName: "Lê Văn C",
    shippingAddress: "789 Phan Xích Long, Phú Nhuận, TP.HCM",
    items: [
      {
        quantity: 2,
        price: 280000,
        productName: "Áo tập gym cổ tròn",
        variantDetails: "Size L / Đen",
        mainImageUrl: null,
      },
    ],
    customerPhone: 84908887766,
    shipperName: "Đã hủy trước khi giao",
    shipperPhone: "0" as unknown as number,
    paymentMethod: "cod",
  },
];

