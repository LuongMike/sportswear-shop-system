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
  import { toast } from "sonner";

  const registerSchema = z
    .object({
      fullName: z
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
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          "Mật khẩu tối thiểu 8 ký tự, gồm chữ và số"
        ),
      confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu"),
      phoneNumber: z.string().nonempty("Vui lòng nhập số điện thoại"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const RegisterPage = () => {
    const navigate = useNavigate();
    const { registerWithEmail, loading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
      try {
        const result = await registerWithEmail(data);
        if (result?.id ?? result?.email) {
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
            duration: 2500,
          });
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 400);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error(error);
      }
    };

    

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

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="mt-1.5"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.fullName.message}
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
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  className="mt-1.5"
                  {...form.register("phoneNumber")}
                />
                {form.formState.errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự, gồm chữ và số"
                  className="mt-1.5"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.password.message}
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
                  {...form.register("confirmPassword")}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
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
