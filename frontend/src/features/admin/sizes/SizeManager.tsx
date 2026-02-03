import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sizeApi } from "@/services/sizeApi";
import type { Size, CreateSizeDTO } from "@/services/sizeApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Pencil, Trash2, Plus, Loader2, Filter } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

export function SizeManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  // Pagination & Filter State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filterChartType, setFilterChartType] = useState<string>("all");

  // Fetch Sizes
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sizes", page, limit, filterChartType],
    queryFn: () =>
      sizeApi.getAll({
        page,
        limit,
        chartType: filterChartType === "all" ? undefined : filterChartType,
      }),
  });

  // Fetch Chart Types
  const { data: chartTypesData } = useQuery({
    queryKey: ["chartTypes"],
    queryFn: sizeApi.getChartTypes,
  });

  // Handle Data Response (Paginated vs Array)
  const responseData = data?.data;
  const sizes =
    (responseData as any)?.sizes ||
    (Array.isArray(responseData) ? responseData : []) ||
    [];
  const totalPages = (responseData as any)?.totalPages || 1;

  const chartTypes = chartTypesData?.data || [];

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateSizeDTO>({
    defaultValues: {
      name: "",
      chartType: "",
      sortOrder: 0,
    },
  });

  // Open Create Dialog
  const handleCreate = () => {
    setEditingSize(null);
    reset({ name: "", chartType: "", sortOrder: 0 });
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleEdit = (size: Size) => {
    setEditingSize(size);
    reset({
      name: size.name,
      chartType: size.chartType,
      sortOrder: size.sortOrder,
    });
    setIsDialogOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: sizeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      toast.success("Tạo kích cỡ thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi tạo kích cỡ");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateSizeDTO }) =>
      sizeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      toast.success("Cập nhật kích cỡ thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật kích cỡ");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: sizeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      toast.success("Xóa kích cỡ thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa kích cỡ");
    },
  });

  const onSubmit = (data: CreateSizeDTO) => {
    if (editingSize) {
      updateMutation.mutate({ id: editingSize.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa kích cỡ này?")) {
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
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý Kích cỡ</h2>
        <div className="flex items-center gap-2">
          {/* Filter Select */}
          <div className="w-[200px]">
            <Select
              value={filterChartType}
              onValueChange={(value) => {
                setFilterChartType(value);
                setPage(1); // Reset to page 1 when filter changes
              }}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Lọc theo loại" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {chartTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="rounded-md border flex-1 overflow-hidden">
        <div className="relative w-full h-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b sticky top-0 bg-background z-10 shadow-sm">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Tên
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Loại bảng size
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Thứ tự
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {sizes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-24 text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                sizes.map((size: Size) => (
                  <tr
                    key={size.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{size.id}</td>
                    <td className="p-4 align-middle font-medium">
                      {size.name}
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {size.chartType}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{size.sortOrder}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(size)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(size.id)}
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

      {/* Pagination */}
      <div className="shrink-0 py-2 border-t">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <span className="sr-only">Previous</span>
                  <span aria-hidden="true">«</span>
                </Button>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <span aria-hidden="true">»</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSize ? "Cập nhật Kích cỡ" : "Thêm Kích cỡ"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên kích cỡ</Label>
              <Input
                id="name"
                placeholder="Ví dụ: XL, 42, Free Size..."
                {...register("name", { required: "Tên là bắt buộc" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chartType">Loại bảng size</Label>
              <Controller
                name="chartType"
                control={control}
                rules={{ required: "Vui lòng chọn loại bảng size" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại bảng size" />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.chartType && (
                <p className="text-sm text-red-500">
                  {errors.chartType.message}
                </p>
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
                {editingSize ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
