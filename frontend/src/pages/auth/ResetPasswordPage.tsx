import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu mới")
      .min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }
    try {
      const result = await resetPassword(token, data.newPassword);
      if (result.success) {
        navigate("/login", { replace: true });
      }
    } catch {
      // Error handled in store
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <Container className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Link không hợp lệ
            </h1>
            <p className="mt-2 text-gray-600">
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu
              cầu gửi lại.
            </p>
            <Link to="/forgot-password" className="mt-6 block">
              <Button>Quên mật khẩu</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <Container className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-red-500 transition-colors"
            >
              SPORTSHOP
            </Link>
            <h1 className="mt-6 text-2xl font-semibold text-gray-900">
              Đặt lại mật khẩu
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Nhập mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 6 ký tự"
                className="mt-1.5"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                className="mt-1.5"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
              <label className="mt-2 flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Hiển thị mật khẩu
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>

          <p className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-red-600 hover:text-red-700"
            >
              ← Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
