import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminProductsApi,
  type AdminProductSummary,
  type AdminProductRequest,
  type AdminVariantRequest,
} from "@/services/adminProductsApi";
import NavigationAPI from "@/services/navigationApi";
import { brandApi } from "@/services/brandApi";
import { sportApi } from "@/services/sportApi";
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
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

export function ProductManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<AdminProductSummary | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch Products (admin)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminProductsApi.getAll,
  });

  console.log("products", data);

  const products = data ?? [];
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedProducts = products.slice(startIndex, startIndex + pageSize);

  // Fetch navigation (categories)
  const { data: navigationData } = useQuery({
    queryKey: ["navigation-main"],
    queryFn: NavigationAPI.getNavigation,
  });

  // Flatten tree: lấy cả danh mục cha + con
  const categoryOptions = useMemo(() => {
    const roots = (navigationData as any)?.data ?? navigationData ?? [];
    const list: { id: number; name: string }[] = [];
    if (!Array.isArray(roots)) return list;

    const walk = (node: any) => {
      if (!node) return;
      if (typeof node.id === "number" && node.categoryName) {
        list.push({ id: node.id, name: node.categoryName });
      }
      (node.children ?? []).forEach((child: any) => walk(child));
    };

    roots.forEach((root: any) => walk(root));
    return list;
  }, [navigationData]);

  // Fetch brands
  const { data: brandsRes } = useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.getAll,
  });
  const brandOptions = brandsRes?.brands ?? [];
  console.log(brandOptions);
  console.log(brandsRes);

  // Fetch sports
  const { data: sportsRes } = useQuery({
    queryKey: ["sports"],
    queryFn: sportApi.getAll,
  });
  const sportOptions = sportsRes ?? [];

  // Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AdminProductRequest>({
    defaultValues: {
      productName: "",
      description: "",
      categoryName: "",
      brandName: "",
      sportName: "",
      variants: [
        {
          size: "",
          color: "",
          price: 0,
          stockQuantity: 0,
          sku: "",
          imageUrls: [""],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleCreate = () => {
    setEditingProduct(null);
    reset({
      productName: "",
      description: "",
      categoryName: "",
      brandName: "",
      sportName: "",
      variants: [
        {
          size: "",
          color: "",
          price: 0,
          stockQuantity: 0,
          sku: "",
          imageUrls: [""],
        },
      ],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = async (product: AdminProductSummary) => {
    setIsDetailLoading(true);
    try {
      const detail = (await adminProductsApi.getDetail(product.id)) as any;
      setEditingProduct(detail);

      const categoryName =
        detail.categoryName ?? detail.categories?.[0]?.name ?? "";
      const brandName = detail.brandName ?? detail.brand?.name ?? "";
      const sportName = detail.sportName ?? detail.sports?.[0]?.name ?? "";

      reset({
        productName: detail.productName,
        description: detail.description || "",
        categoryName,
        brandName,
        sportName,
        variants: detail.variants?.map((v: AdminVariantRequest) => ({
          size: v.size,
          color: v.color,
          price: v.price,
          stockQuantity: v.stockQuantity,
          sku: v.sku,
          imageUrls: v.imageUrls && v.imageUrls.length > 0 ? v.imageUrls : [""],
        })) ?? [
          {
            size: "",
            color: "",
            price: 0,
            stockQuantity: 0,
            sku: "",
            imageUrls: [""],
          },
        ],
      });
      setIsDialogOpen(true);
    } catch (e) {
      toast.error("Không thể tải chi tiết sản phẩm");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: adminProductsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Tạo sản phẩm thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi tạo sản phẩm");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: Partial<AdminProductRequest> }) =>
      adminProductsApi.update(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Cập nhật sản phẩm thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật sản phẩm");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminProductsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa sản phẩm");
    },
  });

  const onSubmit = (values: AdminProductRequest) => {
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        data: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
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
        Đã xảy ra lỗi khi tải danh sách sản phẩm.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Quản lý Sản phẩm
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Danh sách sản phẩm và các biến thể đang bán trên cửa hàng.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
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
                  Tên sản phẩm
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Hình ảnh
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Giá
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Thương hiệu
                </th>
                <th className="h-11 px-4 text-left align-middle font-medium text-muted-foreground">
                  Danh mục
                </th>
                <th className="h-11 px-4 text-right align-middle font-medium text-muted-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {pagedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Không có sản phẩm.
                  </td>
                </tr>
              ) : (
                pagedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-4 align-middle text-xs text-muted-foreground">
                      {product.id}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {product.productName}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-16 w-16 rounded-md overflow-hidden border bg-muted">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.productName}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {product.price?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) ?? "-"}
                    </td>
                    <td className="p-4 align-middle text-sm">
                      {product.brandName ?? "-"}
                    </td>
                    <td className="p-4 align-middle text-sm">
                      {product.categoryName ?? "-"}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(product.id)}
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

      {products.length > pageSize && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            Trang {currentPage}/{totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              {editingProduct ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm"}
              {isDetailLoading && (
                <Loader2 className="inline-block w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Tên sản phẩm</Label>
                <Input
                  id="productName"
                  placeholder="Ví dụ: Áo bóng đá CLB..."
                  {...register("productName", {
                    required: "Tên sản phẩm là bắt buộc",
                  })}
                />
                {errors.productName && (
                  <p className="text-sm text-red-500">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn về sản phẩm..."
                  className="resize-none min-h-[80px]"
                  {...register("description")}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Danh mục</Label>
                <select
                  id="categoryName"
                  className="w-full border rounded-md h-10 px-3 text-sm bg-white"
                  {...register("categoryName", {
                    required: "Danh mục là bắt buộc",
                  })}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categoryOptions.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryName && (
                  <p className="text-sm text-red-500">
                    {errors.categoryName.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandName">Thương hiệu</Label>
                <select
                  id="brandName"
                  className="w-full border rounded-md h-10 px-3 text-sm bg-white"
                  {...register("brandName", {
                    required: "Thương hiệu là bắt buộc",
                  })}
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {brandOptions.map((b) => (
                    <option key={b.id} value={b.brandName}>
                      {b.brandName}
                    </option>
                  ))}
                </select>
                {errors.brandName && (
                  <p className="text-sm text-red-500">
                    {errors.brandName.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sportName">Bộ môn</Label>
                <select
                  id="sportName"
                  className="w-full border rounded-md h-10 px-3 text-sm bg-white"
                  {...register("sportName", {
                    required: "Bộ môn là bắt buộc",
                  })}
                >
                  <option value="">-- Chọn bộ môn --</option>
                  {sportOptions.map((s: any) => (
                    <option key={s.id} value={s.sportName}>
                      {s.sportName}
                    </option>
                  ))}
                </select>
                {errors.sportName && (
                  <p className="text-sm text-red-500">
                    {errors.sportName.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">
                  Biến thể (size / màu / giá / tồn kho)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      size: "",
                      color: "",
                      price: 0,
                      stockQuantity: 0,
                      sku: "",
                      imageUrls: [""],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm biến thể
                </Button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có biến thể nào, vui lòng thêm ít nhất 1 biến thể.
                  </p>
                )}
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-md p-3 space-y-2 relative"
                  >
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-xs text-red-500"
                      onClick={() => remove(index)}
                    >
                      Xóa
                    </button>
                    <div className="grid grid-cols-5 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Size</Label>
                        <Input
                          {...register(`variants.${index}.size` as const, {
                            required: "Size bắt buộc",
                          })}
                          placeholder="M, L, XL..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Màu</Label>
                        <Input
                          {...register(`variants.${index}.color` as const, {
                            required: "Màu bắt buộc",
                          })}
                          placeholder="Đỏ, Xanh..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Giá</Label>
                        <Input
                          type="number"
                          min={0}
                          step={1000}
                          {...register(`variants.${index}.price` as const, {
                            required: "Giá bắt buộc",
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tồn kho</Label>
                        <Input
                          type="number"
                          min={0}
                          {...register(
                            `variants.${index}.stockQuantity` as const,
                            {
                              required: "Tồn kho bắt buộc",
                              valueAsNumber: true,
                            },
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">
                        Ảnh (URL, phân tách bằng dấu phẩy)
                      </Label>
                      <Input
                        {...register(`variants.${index}.imageUrls.0` as const)}
                        placeholder="https://...,https://..."
                      />
                    </div>
                  </div>
                ))}
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
                {editingProduct ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
