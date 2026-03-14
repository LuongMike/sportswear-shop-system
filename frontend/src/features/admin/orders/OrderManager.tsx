import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import React from "react";
import { OrderAPI } from "@/services/orderApi";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

interface OrderItem {
  id: number;
  variantId: number;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  subTotal: number;
  variantImage: string;
}

interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  note: string;
  items: OrderItem[];
}

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
];

export function OrderManager() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const roleName = user?.roleName;
  const isAdmin = roleName === "Quản Trị Viên";
  const isShipper = roleName === "Người giao hàng";
  const { data, isLoading, isError } = useQuery<Order[]>({
    queryKey: ["admin-orders-list"],
    queryFn: async () => {
      const res = await OrderAPI.getAllOrders();

      return await res;
    },
    retry: 1,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await OrderAPI.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-list"] });
    },
  });

  const [editingOrderId, setEditingOrderId] = React.useState<number | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  // Tính toán các trạng thái mà user hiện tại được phép chọn cho một đơn hàng
  function getSelectableStatuses(order: Order): string[] {
    // Những role khác (không phải shipper) không được phép đổi trạng thái
    if (!isShipper && !isAdmin) {
      return [order.status];
    }

    const current = order.status;
    const payment = (order.paymentMethod || "").toLowerCase();

    const allowed = new Set<string>();

    // Người giao hàng chỉ được:
    // PENDING (COD) -> SHIPPED
    if (current === "PENDING" && payment === "cod") {
      allowed.add("SHIPPED");
    }

    // PAID (VNPay/bank) -> SHIPPED
    if (current === "PAID" && payment !== "cod") {
      allowed.add("SHIPPED");
    }

    // SHIPPED -> DELIVERED hoặc CANCELLED
    if (current === "SHIPPED") {
      allowed.add("DELIVERED");
      allowed.add("CANCELLED");
    }

    const nextStatuses = Array.from(allowed);

    // Luôn bao gồm trạng thái hiện tại để hiển thị trong select
    return [current, ...nextStatuses.filter((s) => s !== current)];
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-indigo-100 text-indigo-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Đang tải danh sách đơn hàng...
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        Không có đơn hàng nào.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Quản lý Đơn hàng</h2>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-2 font-medium">Mã đơn</th>
              <th className="p-2 font-medium">Ngày đặt</th>
              <th className="p-2 font-medium">Khách hàng</th>
              <th className="p-2 font-medium">SĐT</th>
              <th className="p-2 font-medium">Tổng tiền</th>
              <th className="p-2 font-medium">Trạng thái</th>
              <th className="p-2 font-medium">Thanh toán</th>
              <th className="p-2 font-medium">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-2 font-semibold">#{order.id}</td>
                <td className="p-2">
                  {new Date(order.orderDate).toLocaleString("vi-VN")}
                </td>
                <td className="p-2">{order.recipientName}</td>
                <td className="p-2">{order.phoneNumber}</td>
                <td className="p-2">
                  {order.totalAmount.toLocaleString("vi-VN")}₫
                </td>
                <td className="p-2">
                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-2">{order.paymentMethod}</td>
                <td className="p-2">
                  {(() => {
                    if (
                      order.status === "CANCELLED" ||
                      order.status === "COMPLETED"
                    ) {
                      return (
                        <span className="text-xs text-gray-400 italic">
                          Không thể cập nhật
                        </span>
                      );
                    }

                    const selectableStatuses = getSelectableStatuses(order);
                    const canEdit = selectableStatuses.length > 1;

                    if (!canEdit) {
                      return (
                        <span className="text-xs text-gray-400 italic">
                          Không có quyền cập nhật
                        </span>
                      );
                    }

                    if (editingOrderId === order.id) {
                      return (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (
                              selectedStatus &&
                              selectedStatus !== order.status
                            ) {
                              // Bảo vệ: chỉ cho phép trạng thái hợp lệ
                              if (selectableStatuses.includes(selectedStatus)) {
                                updateStatusMutation.mutate({
                                  id: order.id,
                                  status: selectedStatus,
                                });
                              }
                            }
                            setEditingOrderId(null);
                          }}
                          className="flex gap-2 items-center"
                        >
                          <select
                            value={selectedStatus || order.status}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="border rounded px-2 py-1"
                            title="Chọn trạng thái đơn hàng"
                          >
                            {selectableStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="submit"
                            className="px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                            disabled={updateStatusMutation.status === "pending"}
                          >
                            Lưu
                          </Button>
                          <Button
                            type="button"
                            className="px-2 py-1 rounded bg-gray-200 text-xs font-semibold"
                            onClick={() => setEditingOrderId(null)}
                          >
                            Hủy
                          </Button>
                        </form>
                      );
                    }

                    return (
                      <Button
                        className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                        onClick={() => {
                          setEditingOrderId(order.id);
                          setSelectedStatus(order.status);
                        }}
                      >
                        Cập nhật
                      </Button>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
