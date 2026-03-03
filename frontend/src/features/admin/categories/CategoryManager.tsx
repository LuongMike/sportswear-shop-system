import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Category = {
  id: number;
  categoryName: string;
  description?: string | null;
  parentId?: number | null;
};

type CategoryRequest = {
  categoryName: string;
  description?: string;
  parentId?: number | null;
};

const categoryAdminApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get("/api/admin/categories");
    const data = res.data?.data ?? res.data ?? [];
    return Array.isArray(data) ? data : [];
  },
  create: async (payload: CategoryRequest): Promise<Category> => {
    const res = await api.post("/api/admin/categories", payload);
    return (res.data?.data ?? res.data) as Category;
  },
  update: async (id: number, payload: CategoryRequest): Promise<Category> => {
    const res = await api.put(`/api/admin/categories/${id}`, payload);
    return (res.data?.data ?? res.data) as Category;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/categories/${id}`);
  },
};

export function CategoryManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: categoryAdminApi.getAll,
  });

  const categories = data ?? [];

  const { roots, childrenByParent } = useMemo(() => {
    const map = new Map<number | null, Category[]>();
    categories.forEach((c) => {
      const key = (c.parentId ?? null) as number | null;
      map.set(key, [...(map.get(key) ?? []), c]);
    });
    // sort theo id cho ổn định UI
    map.forEach((arr, key) => {
      arr.sort((a, b) => a.id - b.id);
      map.set(key, arr);
    });
    return {
      roots: map.get(null) ?? [],
      childrenByParent: map,
    };
  }, [categories]);

  const categoryNameById = useMemo(() => {
    const m = new Map<number, string>();
    categories.forEach((c) => m.set(c.id, c.categoryName));
    return m;
  }, [categories]);

  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(categories.map((c) => c.id)));
  const collapseAll = () => setExpandedIds(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryRequest>({
    defaultValues: {
      categoryName: "",
      description: "",
      parentId: null,
    },
  });

  const handleCreate = () => {
    setEditingCategory(null);
    reset({ categoryName: "", description: "", parentId: null });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      categoryName: category.categoryName,
      description: (category.description ?? "") as string,
      parentId: category.parentId ?? null,
    });
    setIsDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: categoryAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Tạo danh mục thành công");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Lỗi khi tạo danh mục"),
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: CategoryRequest }) =>
      categoryAdminApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Cập nhật danh mục thành công");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Lỗi khi cập nhật danh mục"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Xóa danh mục thành công");
    },
    onError: () => toast.error("Lỗi khi xóa danh mục"),
  });

  const onSubmit = (values: CategoryRequest) => {
    const rawParent = (values as any).parentId;
    const parsedParentId =
      rawParent === "" || rawParent === null || rawParent === undefined
        ? null
        : Number(rawParent);

    const payload: CategoryRequest = {
      categoryName: values.categoryName,
      description: values.description,
      parentId: Number.isNaN(parsedParentId) ? null : parsedParentId,
    };
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý Danh mục</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tạo, cập nhật và xóa danh mục sản phẩm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={expandAll}>
            Mở tất cả
          </Button>
          <Button variant="outline" onClick={collapseAll}>
            Thu gọn
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
        </div>
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
                  Danh mục (cây)
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Mô tả
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Danh mục cha
                </th>
                <th className="h-11 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                <>
                  {(() => {
                    const rows: ReactNode[] = [];
                    const renderNode = (node: Category, depth: number) => {
                      const children = childrenByParent.get(node.id) ?? [];
                      const hasChildren = children.length > 0;
                      const isExpanded = expandedIds.has(node.id);
                      rows.push(
                        <tr
                          key={node.id}
                          className="border-b hover:bg-muted/40 transition-colors"
                        >
                          <td className="p-4 align-middle text-xs text-muted-foreground">
                            {node.id}
                          </td>
                          <td className="p-4 align-middle">
                            <div
                              className="flex items-center gap-2"
                              style={{ paddingLeft: depth * 16 }}
                            >
                              {hasChildren ? (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(node.id)}
                                  className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted"
                                  aria-label={
                                    isExpanded ? "Thu gọn" : "Mở rộng"
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <span className="h-6 w-6 inline-block" />
                              )}
                              <span className="font-medium">
                                {node.categoryName}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-sm text-muted-foreground">
                            {node.description ?? "-"}
                          </td>
                          <td className="p-4 align-middle text-sm text-muted-foreground">
                            {node.parentId
                              ? categoryNameById.get(node.parentId) ?? "—"
                              : "—"}
                          </td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(node)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(node.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>,
                      );

                      if (hasChildren && isExpanded) {
                        children.forEach((child) => renderNode(child, depth + 1));
                      }
                    };

                    roots.forEach((r) => renderNode(r, 0));
                    return rows;
                  })()}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingCategory ? "Cập nhật Danh mục" : "Thêm Danh mục"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Tên danh mục</Label>
              <Input
                id="categoryName"
                placeholder="Ví dụ: Áo thun"
                {...register("categoryName", {
                  required: "Tên danh mục là bắt buộc",
                })}
              />
              {errors.categoryName && (
                <p className="text-sm text-red-500">
                  {errors.categoryName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả danh mục..."
                className="resize-none"
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Danh mục cha (có thể để trống)</Label>
              <select
                id="parentId"
                className="w-full border rounded-md h-10 px-3 text-sm bg-white"
                {...register("parentId" as any)}
              >
                <option value="">-- Không có --</option>
                {categories
                  .filter((c) => !editingCategory || c.id !== editingCategory.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
              </select>
            </div>

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
                className="min-w-[130px]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
