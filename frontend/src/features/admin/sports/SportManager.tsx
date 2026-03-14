import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
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

type Sport = {
  id: number;
  sportName: string;
  description?: string | null;
};

type SportRequest = {
  sportName: string;
  description?: string;
};

const sportAdminApi = {
  getAll: async (): Promise<Sport[]> => {
    const res = await api.get("/api/admin/sports");
    const data = res.data?.data ?? res.data ?? [];
    return Array.isArray(data) ? data : [];
  },
  create: async (payload: SportRequest): Promise<Sport> => {
    const res = await api.post("/api/admin/sports", payload);
    return (res.data?.data ?? res.data) as Sport;
  },
  update: async (id: number, payload: SportRequest): Promise<Sport> => {
    const res = await api.put(`/api/admin/sports/${id}`, payload);
    return (res.data?.data ?? res.data) as Sport;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/sports/${id}`);
  },
};

export function SportManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);

  // Fetch Sports
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sports"],
    queryFn: sportAdminApi.getAll,
  });

  const sports = data ?? [];

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    // setValue,
    formState: { errors },
  } = useForm<SportRequest & { isActive?: boolean; sortOrder?: number; slug?: string; name?: string }>({
    defaultValues: {
      sportName: "",
      description: "",
    },
  });

  // Open Create Dialog
  const handleCreate = () => {
    setEditingSport(null);
    reset({ sportName: "", description: "" });
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleEdit = (sport: Sport) => {
    setEditingSport(sport);
    reset({
      sportName: sport.sportName,
      description: (sport.description ?? "") as string,
    });
    setIsDialogOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (payload: SportRequest) => sportAdminApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] });
      toast.success("Tạo môn thể thao thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi tạo môn thể thao");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SportRequest }) =>
      sportAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] });
      toast.success("Cập nhật môn thể thao thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật môn thể thao");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => sportAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] });
      toast.success("Xóa môn thể thao thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa môn thể thao");
    },
  });

  const onSubmit = (data: any) => {
    const payload: SportRequest = {
      sportName: data.sportName,
      description: data.description,
    };
    if (editingSport) {
      updateMutation.mutate({ id: editingSport.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa môn thể thao này?")) {
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
        Đã xảy ra lỗi khi tải dữ liệu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Quản lý Môn thể thao
        </h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Tên bộ môn
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Mô tả
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {sports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="h-24 text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                sports.map((sport) => (
                  <tr
                    key={sport.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{sport.id}</td>
                    <td className="p-4 align-middle font-medium">
                      {sport.sportName}
                    </td>
                    <td className="p-4 align-middle">
                      {sport.description ?? "-"}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(sport)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(sport.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSport ? "Cập nhật Môn thể thao" : "Thêm Môn thể thao"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sportName">Tên môn thể thao</Label>
              <Input
                id="sportName"
                placeholder="Ví dụ: Bóng đá"
                {...register("sportName", { required: "Tên là bắt buộc" })}
              />
              {(errors as any).sportName && (
                <p className="text-sm text-red-500">
                  {(errors as any).sportName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                placeholder="Mô tả môn thể thao..."
                {...register("description")}
              />
            </div>

            <DialogFooter>
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
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingSport ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
