import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminUsersApi,
  type AdminUserSummary,
  type AdminUserCreateRequest,
  type AdminUserUpdateRequest,
} from "@/services/adminUsersApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UserFormValues = AdminUserCreateRequest;

export function UserManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserSummary | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminUsersApi.getAll,
  });

  const users = data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      roleName: "",
      phoneNumber: "",
    },
  });

  const handleCreate = () => {
    setEditingUser(null);
    reset({
      email: "",
      password: "",
      fullName: "",
      roleName: "",
      phoneNumber: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: AdminUserSummary) => {
    setEditingUser(user);
    reset({
      email: user.email,
      password: "",
      fullName: user.fullName || "",
      roleName: user.roleName || "",
      phoneNumber: user.phoneNumber || "",
      status: user.status,
      lockTime: user.lockTime || null,
    });
    setIsDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: (payload: AdminUserCreateRequest) => adminUsersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Tạo người dùng thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi tạo người dùng");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: AdminUserUpdateRequest }) =>
      adminUsersApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Cập nhật người dùng thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật người dùng");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminUsersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Xóa người dùng thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa người dùng");
    },
  });

  const onSubmit = (values: UserFormValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }
    if (editingUser) {
      const updatePayload: AdminUserUpdateRequest = {
        fullName: values.fullName,
        roleName: values.roleName,
        phoneNumber: values.phoneNumber,
        status: values.status,
      };
      updateMutation.mutate({
        id: editingUser.id,
        data: updatePayload,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách người dùng.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Quản lý Người dùng
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Danh sách tài khoản khách hàng, quản trị viên và người giao hàng.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </Button>
      </div>

      <div className="rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 sticky top-0 z-10">
              <tr className="border-b">
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  ID
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Họ tên
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Số điện thoại
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Vai trò
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="h-11 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-24 text-center text-muted-foreground">
                    Không có người dùng.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-4 align-middle text-xs text-muted-foreground">
                      {user.id}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {user.fullName ?? "-"}
                    </td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">
                      {user.phoneNumber ?? "-"}
                    </td>
                    <td className="p-4 align-middle text-sm">
                      {user.roleName ?? "-"}
                    </td>
                    <td className="p-4 align-middle">
                      {user.lockTime != null ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                          BANNED
                        </span>
                      ) : user.status ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingUser ? "Cập nhật Người dùng" : "Thêm Người dùng"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên</Label>
                <Input
                  id="fullName"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...register("fullName", {
                    required: "Họ tên là bắt buộc",
                  })}
                  disabled={!!editingUser}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email", {
                    required: "Email là bắt buộc",
                  })}
                  disabled={!!editingUser}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {!editingUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc khi tạo mới",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu tối thiểu 8 ký tự, gồm chữ và số",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    {...register("confirmPassword", {
                      required: "Xác nhận mật khẩu là bắt buộc khi tạo mới",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  placeholder="09xxxxxxxx"
                  {...register("phoneNumber")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleName">Vai trò</Label>
                <select
                  id="roleName"
                  className="w-full border rounded-md h-10 px-3 text-sm"
                  {...register("roleName", {
                    required: "Vai trò là bắt buộc",
                  })}
                >
                  <option value="">-- Chọn vai trò --</option>
                  <option value="Thành Viên">Thành viên</option>
                  <option value="Quản Trị Viên">Quản trị viên</option>
                  <option value="Người giao hàng">Người giao hàng</option>
                </select>
                {errors.roleName && (
                  <p className="text-sm text-red-500">
                    {errors.roleName.message}
                  </p>
                )}
              </div>
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái tài khoản</Label>
                <select
                  id="status"
                  className="w-full border rounded-md h-10 px-3 text-sm"
                  {...register("status" as any)}
                >
                  <option value="true">ACTIVE</option>
                  <option value="false">INACTIVE</option>
                </select>
              </div>
            )}

            <DialogFooter className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="min-w-[130px]"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
