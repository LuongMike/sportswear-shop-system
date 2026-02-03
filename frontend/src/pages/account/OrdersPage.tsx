import { useQuery } from "@tanstack/react-query";
import { OrderAPI, type Order } from "@/services/orderApi";
import Container from "@/components/ui/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Loader2, Package } from "lucide-react";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => OrderAPI.getOrders(1, 100),
  });

  const orders = data?.orders || [];
  const totalOrders = data?.pagination?.total || orders.length;

  if (isLoading) {
    return (
      <Container className="py-10 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </Container>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Container className="py-10 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold">Bạn chưa có đơn hàng nào</h2>
          <p className="text-gray-500">
            Hãy khám phá các sản phẩm và đặt hàng ngay nhé!
          </p>
          <Button onClick={() => navigate("/collections")}>Mua sắm ngay</Button>
        </div>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "SHIPPING":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
          <div className="text-gray-500">
            Tổng số:{" "}
            <span className="font-semibold text-gray-900">{totalOrders}</span>{" "}
            đơn hàng
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-lg shadow-sm overflow-hidden border"
            >
              <div className="p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1">
                  <p className="font-medium">
                    Đơn hàng #{order.orderCode || order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Đặt ngày{" "}
                    {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={getStatusColor(order.status)}
                    variant="secondary"
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                  <span className="font-bold text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(order.totalFinalAmount))}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden border border-gray-200">
                        {item.mainImageUrl ? (
                          <img
                            src={item.mainImageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.variantDetails} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-start text-sm text-gray-600">
                  <div>
                    <p>
                      <span className="font-medium">Người nhận:</span>{" "}
                      {order.receiverName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {order.shippingAddress}
                    </p>
                  </div>
                  {/* Note is not in the Order interface currently, skipping */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default OrdersPage;
