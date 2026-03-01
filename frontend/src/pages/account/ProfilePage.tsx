import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI, type UserAddress } from "@/services/userApi";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  MapPin,
  Edit3,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialAddressState = {
  recipientName: "",
  phoneNumber: "",
  city: "",
  district: "",
  ward: "",
  street: "",
};

const ProfilePage = () => {
  const { user, getCurrentUser } = useAuthStore();
  const queryClient = useQueryClient();

  // State quản lý Dialog
  const [addressDialog, setAddressDialog] = useState<{
    open: boolean;
    editId: number | null;
  }>({
    open: false,
    editId: null,
  });

  const [addressForm, setAddressForm] = useState(initialAddressState);

  // --- Queries ---
  const { data: addresses = [], isLoading: isLoadingAddr } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: UserAPI.getAddresses,
  });

  // --- Mutations ---
  const updateProfileMutation = useMutation({
    mutationFn: (name: string) => UserAPI.updateProfile({ fullName: name }),
    onSuccess: () => {
      getCurrentUser();
      toast.success("Đã cập nhật tên hiển thị");
    },
  });

  const upsertAddressMutation = useMutation({
    mutationFn: async () => {
      if (addressDialog.editId) {
        return UserAPI.updateAddress(addressDialog.editId, addressForm);
      }
      return UserAPI.createAddress(addressForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      handleCloseDialog();
      toast.success(
        addressDialog.editId ? "Đã cập nhật địa chỉ" : "Đã thêm địa chỉ mới",
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: UserAPI.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Đã xóa địa chỉ");
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: UserAPI.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Đã đặt làm địa chỉ mặc định");
    },
  });

  // --- Helpers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm mở để THÊM MỚI
  const handleOpenCreate = () => {
    setAddressForm(initialAddressState);
    setAddressDialog({ open: true, editId: null });
  };

  // Hàm mở để CHỈNH SỬA
  const handleOpenEdit = (addr: UserAddress) => {
    setAddressForm({
      recipientName: addr.recipientName || "",
      phoneNumber: addr.phoneNumber || "",
      city: addr.city || "",
      district: addr.district || "",
      ward: addr.ward || "",
      street: addr.street || "",
    });
    setAddressDialog({ open: true, editId: addr.id });
  };

  const handleCloseDialog = () => {
    setAddressDialog({ open: false, editId: null });
    setAddressForm(initialAddressState);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Container className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Cài đặt tài khoản
        </h1>

        <div className="grid gap-8">
          {/* Section 1: Thông tin cá nhân */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-500" /> Thông tin cơ bản
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-600">Họ và tên</Label>
                <div className="flex gap-2">
                  <Input
                    defaultValue={user?.fullName || user?.full_name || ""}
                    onBlur={(e) => {
                      if (
                        e.target.value !== (user?.fullName || user?.full_name)
                      ) {
                        updateProfileMutation.mutate(e.target.value);
                      }
                    }}
                  />
                  {updateProfileMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin mt-3" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">Email đăng nhập</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Sổ địa chỉ */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" /> Sổ địa chỉ nhận hàng
              </h2>

              {/* Nút kích hoạt Dialog */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenCreate}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" /> Thêm địa chỉ mới
              </Button>
            </div>

            {/* Cấu trúc Dialog không dùng Trigger để tránh lỗi nuốt sự kiện */}
            <Dialog
              open={addressDialog.open}
              onOpenChange={setAddressDialog as any}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {addressDialog.editId
                      ? "Chỉnh sửa địa chỉ"
                      : "Thêm địa chỉ mới"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Người nhận</Label>
                      <Input
                        name="recipientName"
                        value={addressForm.recipientName}
                        onChange={handleInputChange}
                        placeholder="VD: Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input
                        name="phoneNumber"
                        value={addressForm.phoneNumber}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        placeholder="Hà Nội"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quận/Huyện</Label>
                      <Input
                        name="district"
                        value={addressForm.district}
                        onChange={handleInputChange}
                        placeholder="Cầu Giấy"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phường/Xã</Label>
                    <Input
                      name="ward"
                      value={addressForm.ward}
                      onChange={handleInputChange}
                      placeholder="Dịch Vọng Hậu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Số nhà, tên đường</Label>
                    <Input
                      name="street"
                      value={addressForm.street}
                      onChange={handleInputChange}
                      placeholder="Số 10, ngõ 2..."
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={handleCloseDialog}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="flex-[2] bg-red-600 hover:bg-red-700"
                      onClick={() => upsertAddressMutation.mutate()}
                      disabled={
                        upsertAddressMutation.isPending ||
                        !addressForm.recipientName ||
                        !addressForm.phoneNumber
                      }
                    >
                      {upsertAddressMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {addressDialog.editId ? "Cập nhật" : "Lưu địa chỉ"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid gap-4">
              {isLoadingAddr ? (
                <div className="py-10 text-center">
                  <Loader2 className="animate-spin mx-auto text-gray-300" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-xl border-gray-100">
                  <MapPin className="w-8 h-8 mx-auto text-gray-200 mb-2" />
                  <p className="text-gray-400">
                    Bạn chưa có địa chỉ giao hàng nào.
                  </p>
                </div>
              ) : (
                addresses.map((addr: UserAddress) => (
                  <div
                    key={addr.id}
                    className={`p-4 border rounded-xl flex justify-between items-start transition-all ${
                      addr.isDefault
                        ? "border-red-200 bg-red-50/30 shadow-sm"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800">
                          {addr.recipientName}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {addr.phoneNumber}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                      </p>
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultMutation.mutate(addr.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2 underline-offset-4 hover:underline"
                        >
                          Thiết lập mặc định
                        </button>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(addr)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          confirm("Xóa địa chỉ này?") &&
                          deleteAddressMutation.mutate(addr.id)
                        }
                        disabled={addr.isDefault}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
