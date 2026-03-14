import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Vui lòng nhập email")
    .email("Email không hợp lệ"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const { requestPasswordReset, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await requestPasswordReset(data.email);
    } catch {
      // Error handled in store
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
              Quên mật khẩu
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Nhập email đăng ký tài khoản. Chúng tôi sẽ gửi link đặt lại mật
              khẩu đến email của bạn.
            </p>
          </div>

          {isSubmitSuccessful ? (
            <div className="space-y-4 text-center">
              <p className="text-gray-600">
                Đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư email
                của bạn (và thư mục spam).
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
          ) : (
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

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
              </Button>
            </form>
          )}

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

export default ForgotPasswordPage;
