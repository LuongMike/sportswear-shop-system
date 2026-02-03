import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colorApi } from "@/services/colorApi";
import type { Color, CreateColorDTO } from "@/services/colorApi";
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

export function ColorManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  // Fetch Colors
  const { data, isLoading, isError } = useQuery({
    queryKey: ["colors"],
    queryFn: colorApi.getAll,
  });

  const colors = data?.data || [];

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateColorDTO>({
    defaultValues: {
      name: "",
      hexCode: "#000000",
    },
  });

  const watchedHexCode = watch("hexCode");

  // Open Create Dialog
  const handleCreate = () => {
    setEditingColor(null);
    reset({ name: "", hexCode: "#000000" });
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleEdit = (color: Color) => {
    setEditingColor(color);
    reset({
      name: color.name,
      hexCode: color.hexCode,
    });
    setIsDialogOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: colorApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast.success("Tạo màu sắc thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi tạo màu sắc");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateColorDTO }) =>
      colorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast.success("Cập nhật màu sắc thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật màu sắc");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: colorApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast.success("Xóa màu sắc thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa màu sắc");
    },
  });

  const onSubmit = (data: CreateColorDTO) => {
    if (editingColor) {
      updateMutation.mutate({ id: editingColor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa màu sắc này?")) {
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
        <h2 className="text-2xl font-bold tracking-tight">Quản lý Màu sắc</h2>
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
                  Màu
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Tên
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Mã Hex
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {colors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-24 text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                colors.map((color) => (
                  <tr
                    key={color.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{color.id}</td>
                    <td className="p-4 align-middle">
                      <div
                        className="w-8 h-8 rounded-full border shadow-sm"
                        style={{ backgroundColor: color.hexCode }}
                      />
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {color.name}
                    </td>
                    <td className="p-4 align-middle font-mono text-xs">
                      {color.hexCode}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(color)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(color.id)}
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingColor ? "Cập nhật Màu sắc" : "Thêm Màu sắc"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên màu</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Đỏ, Xanh dương..."
                {...register("name", { required: "Tên là bắt buộc" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hexCode">Mã màu (Hex)</Label>
              <div className="flex gap-2">
                <Input
                  id="hexCode"
                  type="color"
                  className="w-12 h-10 p-1 cursor-pointer"
                  {...register("hexCode", { required: "Mã màu là bắt buộc" })}
                />
                <Input
                  type="text"
                  placeholder="#000000"
                  className="flex-1 font-mono"
                  {...register("hexCode", {
                    required: "Mã màu là bắt buộc",
                    pattern: {
                      value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      message: "Mã màu không hợp lệ",
                    },
                  })}
                />
              </div>
              {errors.hexCode && (
                <p className="text-sm text-red-500">{errors.hexCode.message}</p>
              )}
            </div>

            <div className="flex items-center justify-center p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: watchedHexCode }}
                />
                <p className="mt-2 text-xs text-muted-foreground font-mono">
                  {watchedHexCode}
                </p>
              </div>
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
                {editingColor ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
