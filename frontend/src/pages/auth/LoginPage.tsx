import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .nonempty("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithEmailPassword, user, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginWithEmailPassword(data.email, data.password);
      if (result.success) {
        navigate("/", { replace: true });
      }
    } catch {
      // Error handled in store
    }
  };

  // Nếu đã đăng nhập, redirect về trang chủ
  if (user) {
    navigate("/", { replace: true });
    return null;
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
              Đăng nhập
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Chào mừng bạn trở lại! Vui lòng đăng nhập tài khoản.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="mt-1.5"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="mt-1.5"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
            <strong>Test (khi API lỗi):</strong> test@sportshop.vn / Test123!
          </p>

          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-700"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
