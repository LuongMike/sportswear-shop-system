import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { isLocalCart } from "@/data/mockCart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "@/services/userApi";
import { OrderAPI } from "@/services/orderApi";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [selectedPhoneId, setSelectedPhoneId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank">("cod");

  // Fetch Cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fetch Addresses
  const { data: addresses, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: UserAPI.getAddresses,
  });

  // Fetch Phones
  const { data: phones, isLoading: isLoadingPhones } = useQuery({
    queryKey: ["user-phones"],
    queryFn: UserAPI.getPhones,
  });

  // Set defaults
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (phones && phones.length > 0 && !selectedPhoneId) {
      const defaultPhone = phones.find((p) => p.is_default) || phones[0];
      setSelectedPhoneId(defaultPhone.id);
    }
  }, [phones, selectedPhoneId]);

  // Mutations
  const createAddressMutation = useMutation({
    mutationFn: UserAPI.createAddress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      setSelectedAddressId(data.id);
      setIsAddressDialogOpen(false);
      setNewAddress("");
      toast.success("Đã thêm địa chỉ mới");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi khi thêm địa chỉ");
    },
  });

  const createPhoneMutation = useMutation({
    mutationFn: UserAPI.createPhone,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-phones"] });
      setSelectedPhoneId(data.id);
      setIsPhoneDialogOpen(false);
      setNewPhone("");
      toast.success("Đã thêm số điện thoại mới");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Lỗi khi thêm số điện thoại",
      );
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: OrderAPI.createOrder,
    onSuccess: () => {
      toast.success("Đặt hàng thành công!");
      // Clear cart locally if needed, but backend handles it
      fetchCart();
      navigate(`/account/orders`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi khi đặt hàng");
    },
  });

  const handlePlaceOrder = () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }
    if (isLocalCart(cart)) {
      toast.error(
        "Giỏ hàng đang dùng dữ liệu demo. Kết nối API để thanh toán.",
      );
      return;
    }
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!selectedPhoneId) {
      toast.error("Vui lòng chọn số điện thoại");
      return;
    }

    createOrderMutation.mutate({
      cartId: cart.id,
      shippingAddressId: selectedAddressId,
      userPhoneId: selectedPhoneId,
      note,
      paymentMethod,
    });
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
    const price = item.variant.price;
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
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Thêm địa chỉ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Địa chỉ chi tiết</Label>
                        <Input
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder="Số nhà, tên đường, phường/xã..."
                        />
                      </div>
                      <Button
                        onClick={() =>
                          createAddressMutation.mutate({
                            address_detail: newAddress,
                            is_default: true,
                          })
                        }
                        disabled={
                          createAddressMutation.isPending || !newAddress
                        }
                        className="w-full"
                      >
                        {createAddressMutation.isPending && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Lưu địa chỉ
                      </Button>
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
                        className="flex-1 cursor-pointer"
                      >
                        {addr.address_detail}{" "}
                        {addr.is_default && (
                          <span className="text-xs text-blue-600 font-medium ml-2">
                            (Mặc định)
                          </span>
                        )}
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

            {/* Phone Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Số điện thoại</h2>
                <Dialog
                  open={isPhoneDialogOpen}
                  onOpenChange={setIsPhoneDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Thêm SĐT
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm số điện thoại mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="0901234567"
                        />
                      </div>
                      <Button
                        onClick={() =>
                          createPhoneMutation.mutate({
                            phone_number: newPhone,
                            is_default: true,
                          })
                        }
                        disabled={createPhoneMutation.isPending || !newPhone}
                        className="w-full"
                      >
                        {createPhoneMutation.isPending && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Lưu số điện thoại
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoadingPhones ? (
                <p>Đang tải số điện thoại...</p>
              ) : phones && phones.length > 0 ? (
                <RadioGroup
                  value={selectedPhoneId?.toString()}
                  onValueChange={(val: string) =>
                    setSelectedPhoneId(Number(val))
                  }
                  className="space-y-3"
                >
                  {phones.map((phone) => (
                    <div
                      key={phone.id}
                      className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <RadioGroupItem
                        value={phone.id.toString()}
                        id={`phone-${phone.id}`}
                      />
                      <Label
                        htmlFor={`phone-${phone.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {phone.phone_number}{" "}
                        {phone.is_default && (
                          <span className="text-xs text-blue-600 font-medium ml-2">
                            (Mặc định)
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-red-500 text-sm">
                  Bạn chưa có số điện thoại nào. Vui lòng thêm SĐT.
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
                  const price = item.variant.price;
                  return (
                    <div key={item.itemId} className="flex gap-3 text-sm">
                      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden border">
                        <img
                          src={
                            item.variant.image ||
                            item.product.mainImageUrl ||
                            ""
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {item.variant.color?.name || "N/A"} /{" "}
                          {item.variant.size?.name || "N/A"}
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
                      setPaymentMethod(val as "cod" | "bank")
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
                      <RadioGroupItem value="bank" id="pay-bank" />
                      <Label
                        htmlFor="pay-bank"
                        className="cursor-pointer flex-1"
                      >
                        Chuyển khoản ngân hàng
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "bank" && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md text-sm">
                      <img
                        src="/images/bank-transfer.png"
                        alt="Bank Transfer"
                      />
                    </div>
                  )}
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
