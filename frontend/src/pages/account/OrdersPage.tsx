import { useQuery } from "@tanstack/react-query";
import { OrderAPI, type Order } from "@/services/orderApi";
import Container from "@/components/ui/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Loader2, Package } from "lucide-react";
import { getLatestOrder } from "@/utils/orderStorage";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => OrderAPI.getOrders(),
    retry: 1,
  });

  const latestOrder = getLatestOrder();

  const orders: Order[] = isError
    ? latestOrder
      ? [latestOrder]
      : []
    : Array.isArray(data)
      ? data
      : [];

  // Tự động hủy đơn nếu quá 7 ngày mà chưa được xác thực
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const toCancel = (orders as any[]).filter((order) => {
      const createdAt = new Date(order.orderDate).getTime();
      if (Number.isNaN(createdAt)) return false;
      const isOlderThan7Days = now - createdAt > sevenDaysMs;
      const status = order.status;
      return (
        isOlderThan7Days && status !== "CANCELLED" && status !== "COMPLETED"
      );
    });

    if (toCancel.length === 0) return;

    (async () => {
      try {
        await Promise.all(
          toCancel.map((order) =>
            OrderAPI.userUpdateOrderStatus(
              order.id ?? order.orderId,
              "CANCELLED",
            ),
          ),
        );
        await refetch();
      } catch (error) {
        console.error("Auto-cancel orders error:", error);
      }
    })();
  }, [orders, refetch]);

  const handleUserUpdateStatus = async (
    orderId: number,
    status: "COMPLETED" | "CANCELLED",
  ) => {
    try {
      await OrderAPI.userUpdateOrderStatus(orderId, status);
      toast.success(
        status === "COMPLETED"
          ? "Xác nhận đã nhận hàng thành công"
          : "Cập nhật đơn hàng chưa nhận hàng thành công",
      );
      await refetch();
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error("Cập nhật trạng thái đơn hàng thất bại");
    }
  };

  if (isLoading) {
    return (
      <Container className="py-10 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-10 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold">Bạn chưa có đơn hàng nào</h2>
          <Button onClick={() => navigate("/collections")}>Mua sắm ngay</Button>
        </div>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
          {isError && (
            <span className="text-sm text-orange-500">
              ⚠ Hiển thị đơn hàng gần nhất (offline)
            </span>
          )}
        </div>

        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id ?? order.orderId}
              className="bg-white border rounded-lg"
            >
              <div className="p-4 border-b flex justify-between bg-gray-50">
                <div>
                  <p className="font-medium">
                    Đơn hàng #{order.id ?? order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleString("vi-VN")}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="p-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.variantImage ?? "/product-placeholder.svg"}
                      className="w-20 h-20 rounded object-cover"
                      alt={item.productName}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Xem thông tin đầy đủ
                  </Button>
                </div>
                {order.status == "DELIVERED" && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    {order.status !== "CANCELLED" &&
                      order.status !== "COMPLETED" && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUserUpdateStatus(
                                order.id ?? order.orderId,
                                "COMPLETED",
                              )
                            }
                          >
                            Đã nhận hàng
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleUserUpdateStatus(
                                order.id ?? order.orderId,
                                "CANCELLED",
                              )
                            }
                          >
                            Chưa nhận hàng
                          </Button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ===== MODAL DETAIL ===== */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6 text-sm">
                <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
                  <div>
                    <p className="font-medium">Người nhận hàng</p>
                    <p>Họ và tên: {selectedOrder.recipientName || "N/A"}</p>
                    <p>Số điện thoại: {selectedOrder.phoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Ghi chú</p>
                    <p>{selectedOrder.note || "—"}</p>
                  </div>
                </div>
                <div className="border p-4 rounded-lg">
                  <p className="font-medium mb-1">Địa chỉ giao hàng</p>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
                <div className="border p-4 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">Phương thức thanh toán</p>
                    <p>{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="font-medium">Trạng thái</p>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border p-3 rounded">
                      <img
                        src={item.variantImage ?? "/product-placeholder.svg"}
                        className="w-16 h-16 rounded object-cover"
                        alt={item.productName}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-gray-500">
                          {item.color} / {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end border-t pt-4">
                  <p className="text-lg font-bold text-blue-600">
                    Tổng tiền:{" "}
                    {formatCurrency(Number(selectedOrder.totalAmount))}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default OrdersPage;
