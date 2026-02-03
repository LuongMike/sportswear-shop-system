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

const registerSchema = z
  .object({
    full_name: z
      .string()
      .nonempty("Vui lòng nhập họ tên")
      .min(2, "Họ tên tối thiểu 2 ký tự"),
    email: z
      .string()
      .nonempty("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerWithEmail, user, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerWithEmail({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        // Đăng ký thành công nhưng cần đăng nhập
        navigate("/login", { replace: true });
      }
    } catch {
      // Error handled in store
    }
  };

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
              Đăng ký tài khoản
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Tạo tài khoản để mua sắm và theo dõi đơn hàng.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Nguyễn Văn A"
                className="mt-1.5"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

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
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 6 ký tự"
                className="mt-1.5"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
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
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-700"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default RegisterPage;
