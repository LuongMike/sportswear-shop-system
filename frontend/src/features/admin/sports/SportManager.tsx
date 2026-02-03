import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sportApi } from "@/services/sportApi";
import type { Sport, CreateSportDTO } from "@/services/sportApi";
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
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export function SportManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);

  // Fetch Sports
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sports"],
    queryFn: sportApi.getAll,
  });

  const sports = data?.data || [];

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    // setValue,
    control,
    formState: { errors },
  } = useForm<CreateSportDTO>({
    defaultValues: {
      name: "",
      slug: "",
      isActive: true,
      sortOrder: 0,
    },
  });

  // Open Create Dialog
  const handleCreate = () => {
    setEditingSport(null);
    reset({ name: "", slug: "", isActive: true, sortOrder: 0 });
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleEdit = (sport: Sport) => {
    setEditingSport(sport);
    reset({
      name: sport.name,
      slug: sport.slug,
      isActive: sport.isActive,
      sortOrder: sport.sortOrder,
    });
    setIsDialogOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: sportApi.create,
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
    mutationFn: ({ id, data }: { id: number; data: CreateSportDTO }) =>
      sportApi.update(id, data),
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
    mutationFn: sportApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports"] });
      toast.success("Xóa môn thể thao thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa môn thể thao");
    },
  });

  const onSubmit = (data: CreateSportDTO) => {
    if (editingSport) {
      updateMutation.mutate({ id: editingSport.id, data });
    } else {
      createMutation.mutate(data);
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
                  Tên
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Slug
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Thứ tự
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Trạng thái
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {sports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center">
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
                      {sport.name}
                    </td>
                    <td className="p-4 align-middle">{sport.slug}</td>
                    <td className="p-4 align-middle">{sport.sortOrder}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          sport.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sport.isActive ? "Active" : "Inactive"}
                      </span>
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
              <Label htmlFor="name">Tên môn thể thao</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Bóng đá"
                {...register("name", { required: "Tên là bắt buộc" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="Ví dụ: bong-da"
                {...register("slug", { required: "Slug là bắt buộc" })}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isActive">Kích hoạt</Label>
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
