import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
// import { isLocalCart } from "@/data/mockCart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "@/services/userApi";
import { OrderAPI } from "@/services/orderApi";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { saveLatestOrder } from "@/utils/orderStorage";
import { PaymentAPI } from "@/services/payment.api";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialAddressForm = {
  recipientName: "",
  phoneNumber: "",
  city: "",
  district: "",
  ward: "",
  street: "",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressForm, setAddressForm] = useState(initialAddressForm);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "VNPAY">("cod");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  // Fetch Cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fetch Addresses
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: UserAPI.getAddresses,
  });

  useEffect(() => {
    if (!addresses || addresses.length === 0) return;

    setSelectedAddressId(
      (prev) =>
        prev ?? addresses.find((a) => a.isDefault)?.id ?? addresses[0].id,
    );
  }, [addresses]);

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetAddressForm = () => {
    setAddressForm(initialAddressForm);
  };

  // Mutations
  const createAddressMutation = useMutation({
    mutationFn: async () => {
      return UserAPI.createAddress(addressForm as any);
    },
    onSuccess: (data) => {
      const created = (data as any)?.data ?? data;
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      if (created?.id) {
        setSelectedAddressId(created.id);
      }
      setIsAddressDialogOpen(false);
      resetAddressForm();
      toast.success("Đã thêm địa chỉ mới");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi khi thêm địa chỉ");
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: OrderAPI.createOrder,

    onSuccess: async (res: any) => {
      const data = res?.data ?? res;
      const orderId = data?.orderId ?? data?.id;
      const orderCode = data?.orderCode ?? data?.code;
      const selectedAddress = addresses?.find(
        (a) => a.id === selectedAddressId,
      );

      const orderForStorage = {
        orderId: orderId ?? res?.orderId,
        orderCode: orderCode ?? res?.orderCode ?? `ORD-${orderId}`,
        orderDate: data?.createdAt ?? new Date().toISOString(),
        status: data?.status ?? "PENDING",

        // 🔥 NGƯỜI ĐẶT
        customerName: user?.fullName ?? user?.full_name,
        customerPhone: user?.phone,

        shippingAddress: selectedAddress
          ? `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`
          : "",

        paymentMethod: paymentMethod,

        totalFinalAmount: data?.total ?? totalAmount,

        items: cart!.items.map((item) => ({
          productName: item.product?.name ?? item.productName,
          variantDetails: item.variant
            ? `${item.variant.color?.name ?? ""} / ${item.variant.size?.name ?? ""}`.trim() ||
              "—"
            : "—",
          quantity: item.quantity,
          price: item.variant?.price ?? item.price,
          mainImageUrl: item.imageUrl || item.product?.mainImageUrl || "",
        })),
      };

      // ✅ LƯU LOCALSTORAGE
      saveLatestOrder(orderForStorage as any);

      if (paymentMethod === "cod") {
        toast.success("Đặt hàng thành công!");
        fetchCart();
        navigate("/account/orders");
        return;
      }

      if (paymentMethod === "VNPAY" && orderId) {
        try {
          const paymentUrl = await PaymentAPI.getPaymentUrl(orderId);
          window.location.href = paymentUrl;
        } catch (err) {
          toast.error(
            "Không thể tạo link thanh toán. Chuyển đến trang xác nhận.",
          );
          navigate(`/payment/${orderId}`);
        }
      } else if (paymentMethod === "VNPAY") {
        navigate(`/payment/${data?.paymentId ?? orderId ?? Date.now()}`);
      }
    },

    onError: () => {
      toast.info("Đang dùng dữ liệu demo");

      const selectedAddress = addresses?.find(
        (a) => a.id === selectedAddressId,
      );

      const fakeOrder = {
        orderId: Date.now(),
        orderCode: `DEMO-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: "PENDING",

        // 🔥 NGƯỜI ĐẶT
        customerName: user?.fullName ?? user?.full_name,
        customerPhone: user?.phone,

        shippingAddress: selectedAddress
          ? `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`
          : "",

        paymentMethod: paymentMethod,

        totalFinalAmount: totalAmount,

        items: cart!.items.map((item) => ({
          productName: item.product?.name ?? item.productName,
          variantDetails: item.variant
            ? `${item.variant.color?.name ?? ""} / ${item.variant.size?.name ?? ""}`.trim() ||
              "—"
            : "—",
          quantity: item.quantity,
          price: item.variant?.price ?? item.price,
          mainImageUrl: item.imageUrl || item.product?.mainImageUrl || "",
        })),
      };

      saveLatestOrder(fakeOrder as any);

      if (paymentMethod === "cod") {
        navigate("/account/orders");
        return;
      }

      navigate(`/payment/${Date.now()}`);
    },
  });

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Thiếu thông tin giao hàng");
      return;
    }

    try {
      // Gọi API tạo đơn hàng
      const orderRes = await OrderAPI.createOrder({
        addressId: selectedAddressId,
        paymentMethod: paymentMethod === "cod" ? "cod" : "VNPAY",
        note,
      });
      const orderId =
        orderRes?.data?.orderId ?? orderRes?.orderId ?? orderRes?.id;

      if (paymentMethod === "cod") {
        toast.success("Đặt hàng thành công!");
        fetchCart();
        navigate("/account/orders");
      } else if (paymentMethod === "VNPAY" && orderId) {
        const paymentUrl = await PaymentAPI.getPaymentUrl(orderId);
        if (typeof paymentUrl === "string" && paymentUrl.startsWith("http")) {
          window.location.href = paymentUrl;
        } else {
          toast.error("Không lấy được link thanh toán");
          navigate(`/payment/${orderId}`);
        }
      }
    } catch {
      toast.error("Có lỗi khi đặt hàng");
    }
  };

  if (!user) {
    return (
      <Container className="py-10 text-center">
        <p>Vui lòng đăng nhập để thanh toán</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Về trang chủ
        </Button>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-10 text-center">
        <p>Giỏ hàng của bạn đang trống</p>
        <Button onClick={() => navigate("/collections")} className="mt-4">
          Mua sắm ngay
        </Button>
      </Container>
    );
  }

  const totalAmount = cart.items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.price ?? 0;
    return sum + Number(price) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-6">Thanh Toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
                <Dialog
                  open={isAddressDialogOpen}
                  onOpenChange={setIsAddressDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetAddressForm();
                        setIsAddressDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Thêm địa chỉ
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-md"
                    onInteractOutside={() => resetAddressForm()}
                  >
                    <DialogHeader>
                      <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Người nhận</Label>
                          <Input
                            name="recipientName"
                            value={addressForm.recipientName}
                            onChange={handleAddressInputChange}
                            placeholder="VD: Nguyễn Văn A"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Số điện thoại</Label>
                          <Input
                            name="phoneNumber"
                            value={addressForm.phoneNumber}
                            onChange={handleAddressInputChange}
                            placeholder="09xxxx"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tỉnh/Thành phố</Label>
                          <Input
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressInputChange}
                            placeholder="Hà Nội"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quận/Huyện</Label>
                          <Input
                            name="district"
                            value={addressForm.district}
                            onChange={handleAddressInputChange}
                            placeholder="Cầu Giấy"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Phường/Xã</Label>
                        <Input
                          name="ward"
                          value={addressForm.ward}
                          onChange={handleAddressInputChange}
                          placeholder="Dịch Vọng Hậu"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Số nhà, tên đường</Label>
                        <Input
                          name="street"
                          value={addressForm.street}
                          onChange={handleAddressInputChange}
                          placeholder="Số 10, ngõ 2..."
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="ghost"
                          className="flex-1"
                          type="button"
                          onClick={() => {
                            resetAddressForm();
                            setIsAddressDialogOpen(false);
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          className="flex-[2]"
                          onClick={() => createAddressMutation.mutate()}
                          disabled={
                            createAddressMutation.isPending ||
                            !addressForm.recipientName ||
                            !addressForm.phoneNumber ||
                            !addressForm.city ||
                            !addressForm.district ||
                            !addressForm.ward ||
                            !addressForm.street
                          }
                        >
                          {createAddressMutation.isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Lưu địa chỉ
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingAddresses ? (
                <p>Đang tải địa chỉ...</p>
              ) : addresses && addresses.length > 0 ? (
                <RadioGroup
                  value={selectedAddressId?.toString()}
                  onValueChange={(val: string) =>
                    setSelectedAddressId(Number(val))
                  }
                  className="space-y-3"
                >
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={addr.id.toString()}
                        id={`addr-${addr.id}`}
                      />
                      <Label
                        htmlFor={`addr-${addr.id}`}
                        className="flex-1 cursor-pointer space-y-1"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">
                            {addr.recipientName}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-600">
                            {addr.phoneNumber}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] text-blue-600 font-medium ml-2 uppercase">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {addr.street}, {addr.ward}, {addr.district},{" "}
                          {addr.city}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-red-500 text-sm">
                  Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ.
                </p>
              )}
            </div>

            {/* Note Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Ghi chú đơn hàng</h2>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho người giao hàng..."
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cart.items.map((item) => {
                  const price = item.variant?.price ?? item.price;
                  const itemId = item.itemId ?? item.id ?? item.productId;
                  return (
                    <div key={itemId} className="flex gap-3 text-sm">
                      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden border">
                        <img
                          src={
                            item.imageUrl 
                            || ""
                          }
                          alt={item.product?.name ?? item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2">
                          {item.product?.name ?? item.productName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {item.color ?? "N/A"} /{" "}
                          {item.size ?? "N/A"}
                        </p>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(Number(price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalAmount)}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Phương thức thanh toán
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(val) =>
                      setPaymentMethod(val as "cod" | "VNPAY")
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer">
                      <RadioGroupItem value="cod" id="pay-cod" />
                      <Label
                        htmlFor="pay-cod"
                        className="cursor-pointer flex-1"
                      >
                        Thanh toán khi nhận hàng (COD)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer">
                      <RadioGroupItem value="VNPAY" id="pay-VNPAY" />
                      <Label
                        htmlFor="pay-VNPAY"
                        className="cursor-pointer flex-1"
                      >
                        Chuyển khoản ngân hàng
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
