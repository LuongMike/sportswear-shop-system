import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "@/services/userApi";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, MapPin, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const fallbackAddresses = user?.address
    ? [
        {
          id: "user-default-address",
          address_detail: user.address,
          is_default: true,
          is_fallback: true,
        },
      ]
    : [];

  const fallbackPhones = user?.phone
    ? [
        {
          id: "user-default-phone",
          phone_number: user.phone,
          is_default: true,
          is_fallback: true,
        },
      ]
    : [];

  // Fetch Addresses
  const {
    data: phones = fallbackPhones,
    isLoading: isLoadingPhones,
    isError,
  } = useQuery<UserPhone[]>({
    queryKey: ["user-phones"],
    queryFn: async () => {
      try {
        return await UserAPI.getPhones();
      } catch (error) {
        console.warn("API phone lỗi – dùng phone từ user");
        return fallbackPhones; // ✅ fallback tại đây
      }
    },
  });

  const { data: addresses = fallbackAddresses, isLoading: isLoadingAddresses } =
    useQuery<UserAddress[]>({
      queryKey: ["user-addresses"],
      queryFn: async () => {
        try {
          return await UserAPI.getAddresses();
        } catch (error) {
          console.warn("API address lỗi – dùng address từ user");
          return fallbackAddresses;
        }
      },
    });

  // Mutations
  const createAddressMutation = useMutation({
    mutationFn: UserAPI.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      setIsAddressDialogOpen(false);
      setNewAddress("");
      toast.success("Đã thêm địa chỉ mới");
    },
    onError: (error: any) => {
      // toast.error(error.response?.data?.message || "Lỗi khi thêm địa chỉ");
      const fakeAddress = {
        id: Date.now(), // id ảo
        address_detail: newAddress,
        is_default: addresses?.length === 0,
        __mock: true, // đánh dấu fake
      };

      queryClient.setQueryData(["user-addresses"], (old: any[] = []) => [
        ...old,
        fakeAddress,
      ]);

      setIsAddressDialogOpen(false);
      setNewAddress("");

      toast.warning("API lỗi – đang dùng dữ liệu ảo để test");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: UserAPI.deleteAddress,

    onMutate: async (addressId) => {
      await queryClient.cancelQueries({ queryKey: ["user-addresses"] });

      const previousAddresses = queryClient.getQueryData<any[]>([
        "user-addresses",
      ]);

      // Xóa tạm trong cache
      queryClient.setQueryData(["user-addresses"], (old: any[] = []) =>
        old.filter((addr) => addr.id !== addressId),
      );

      return { previousAddresses };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast.success("Đã xóa địa chỉ");
    },

    onError: (error, _id, context) => {
      console.warn("API xóa địa chỉ lỗi – dùng dữ liệu ảo");

      // ❗ không rollback → giữ trạng thái đã xóa
      toast.warning("API lỗi, đang giả lập xóa địa chỉ");
    },
  });

  const createPhoneMutation = useMutation({
    mutationFn: UserAPI.createPhone,

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["user-phones"] });

      const previousPhones = queryClient.getQueryData<any[]>(["user-phones"]);

      const mockPhone = {
        id: `mock-${Date.now()}`,
        phone_number: payload.phone_number,
        is_default: previousPhones?.length === 0,
        is_mock: true,
      };

      queryClient.setQueryData(["user-phones"], (old: any[] = []) => [
        ...old,
        mockPhone,
      ]);

      return { previousPhones, mockPhone };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-phones"] });
      setIsPhoneDialogOpen(false);
      setNewPhone("");
      toast.success("Đã thêm số điện thoại mới");
    },
    onError: (error, _payload, context) => {
      console.warn("API thêm phone lỗi – dùng mock");
      toast.warning("API lỗi, đang dùng số điện thoại ảo để test");

      setIsPhoneDialogOpen(false);
      setNewPhone("");
    },
  });

  const deletePhoneMutation = useMutation({
    mutationFn: UserAPI.deletePhone,

    onMutate: async (phoneId) => {
      await queryClient.cancelQueries({ queryKey: ["user-phones"] });

      const previousPhones = queryClient.getQueryData<any[]>(["user-phones"]);

      queryClient.setQueryData(["user-phones"], (old: any[] = []) =>
        old.filter((phone) => phone.id !== phoneId),
      );

      return { previousPhones };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-phones"] });
      toast.success("Đã xóa số điện thoại");
    },

    onError: (error, _id, context) => {
      console.warn("API xóa phone lỗi – dùng dữ liệu ảo");
      toast.warning("API lỗi, đang giả lập xóa số điện thoại");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <div className="p-2 bg-gray-50 rounded border mt-1">
                {user?.email}
              </div>
            </div>
            <div>
              <Label>Họ tên</Label>
              <div className="p-2 bg-gray-50 rounded border mt-1">
                {user?.full_name || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Sổ địa chỉ
              </h2>
              <Dialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Thêm
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
                          is_default: addresses?.length === 0,
                        })
                      }
                      disabled={createAddressMutation.isPending || !newAddress}
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
              <p>Đang tải...</p>
            ) : (
              <div className="space-y-3">
                {addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex justify-between items-center border p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{addr.address_detail}</p>
                      {addr.is_default && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
                          deleteAddressMutation.mutate(addr.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {addresses?.length === 0 && (
                  <p className="text-gray-500 text-sm">Chưa có địa chỉ nào.</p>
                )}
              </div>
            )}
          </div>

          {/* Phone Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="w-5 h-5" /> Số điện thoại
              </h2>
              <Dialog
                open={isPhoneDialogOpen}
                onOpenChange={setIsPhoneDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Thêm
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
                          is_default: phones?.length === 0,
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
              <p>Đang tải...</p>
            ) : (
              <div className="space-y-3">
                {phones?.map((phone) => (
                  <div
                    key={phone.id}
                    className="flex justify-between items-center border p-3 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{phone.phone_number}</p>
                      {phone.is_default && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (
                          confirm("Bạn có chắc muốn xóa số điện thoại này?")
                        ) {
                          deletePhoneMutation.mutate(phone.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {phones?.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Chưa có số điện thoại nào.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
