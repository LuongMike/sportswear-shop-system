import { useState } from "react";
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
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

type Brand = {
  id: number;
  brandName?: string;
  name?: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  brandBanner?: string | null;
  banner?: string | null;
  isActive?: boolean;
};

type CreateBrandDTO = {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  banner?: string;
  isActive?: boolean;
};

const brandAdminApi = {
  getAll: async (): Promise<Brand[]> => {
    const res = await api.get("/api/brands");
    const brands = res.data?.data?.brands ?? res.data?.brands ?? res.data ?? [];
    return Array.isArray(brands) ? brands : [];
  },
  create: async (payload: CreateBrandDTO): Promise<Brand> => {
    const res = await api.post("/api/brands", payload);
    return (res.data?.data ?? res.data) as Brand;
  },
  update: async (id: number, payload: CreateBrandDTO): Promise<Brand> => {
    const res = await api.put(`/api/brands/${id}`, payload);
    return (res.data?.data ?? res.data) as Brand;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/brands/${id}`);
  },
};

export function BrandManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Fetch Brands
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands"],
    queryFn: brandAdminApi.getAll,
  });

  const brands: Brand[] = Array.isArray(data) ? data : [];

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateBrandDTO>({
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      description: "",
      banner: "",
      isActive: true,
    },
  });

  // Open Create Dialog
  const handleCreate = () => {
    setEditingBrand(null);
    reset({
      name: "",
      slug: "",
      logo: "",
      description: "",
      banner: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    reset({
      name: brand.brandName ?? brand.name ?? "",
      slug: brand.slug,
      logo: brand.logo || "",
      description: brand.description || "",
      banner: (brand.brandBanner ?? brand.banner) || "",
      isActive: brand.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: brandAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Tạo thương hiệu thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi tạo thương hiệu");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateBrandDTO }) =>
      brandAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Cập nhật thương hiệu thành công");
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật thương hiệu");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => brandAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Xóa thương hiệu thành công");
    },
    onError: () => {
      toast.error("Lỗi khi xóa thương hiệu");
    },
  });

  const onSubmit = (data: CreateBrandDTO) => {
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
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
          Quản lý Thương hiệu
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
                  Logo
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Thương hiệu
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Banner
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Slug
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
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-24 text-center">
                    Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  (() => {
                    const displayName = brand.brandName ?? brand.name ?? "-";
                    const banner = brand.brandBanner ?? brand.banner ?? "";
                    return (
                  <tr
                    key={brand.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{brand.id}</td>
                    <td className="p-4 align-middle">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={displayName}
                          className="h-8 w-8 object-contain rounded-sm border bg-white"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-muted rounded-sm" />
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {displayName}
                    </td>
                    <td className="p-4 align-middle">
                      {banner ? (
                        <div className="h-8 w-20 rounded-sm overflow-hidden border bg-muted">
                          <img
                            src={banner}
                            alt={`${displayName} banner`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-20 bg-muted rounded-sm" />
                      )}
                    </td>
                    <td className="p-4 align-middle">{brand.slug}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          brand.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {brand.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(brand)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(brand.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                    );
                  })()
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? "Cập nhật Thương hiệu" : "Thêm Thương hiệu"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên thương hiệu</Label>
                <Input
                  id="name"
                  placeholder="Ví dụ: Nike"
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
                  placeholder="Ví dụ: nike"
                  {...register("slug", { required: "Slug là bắt buộc" })}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                {...register("logo")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả về thương hiệu..."
                className="resize-none"
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner URL</Label>
              <Input
                id="banner"
                placeholder="https://example.com/banner.png"
                {...register("banner")}
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
                {editingBrand ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
