import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { User } from "lucide-react";
import { Input } from "../ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "../ui/button";
import { toast } from "sonner";

const createAuthSchema = (isSignup: boolean) =>
  z.object({
    identifier: z
      .string()
      .nonempty("Vui lòng nhập email hoặc số điện thoại")
      .refine(
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
          /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/.test(value),
        "Vui lòng nhập email hoặc số điện thoại hợp lệ"
      ),
    firstName: isSignup
      ? z.string().nonempty("Tên là bắt buộc")
      : z.string().optional(),
    lastName: isSignup
      ? z.string().nonempty("Họ là bắt buộc")
      : z.string().optional(),
  });

type AuthFormData = z.infer<ReturnType<typeof createAuthSchema>>;

const AuthFormDialog = ({
  handleSignup,
  isSignup,
}: {
  handleSignup: () => void;
  isSignup: boolean;
}) => {
  const { otpSent, verifyOtp, loading, setOtpSent } = useAuthStore();
  const [otpValue, setOtpValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(createAuthSchema(isSignup)),
  });

  // Reset form when switching modes
  useEffect(() => {
    reset();
    setOtpSent(false); // Reset OTP state when switching modes or closing/opening
  }, [isSignup, reset, setOtpSent, isOpen]);

  const onsubmit = async (data: AuthFormData) => {
    try {
      const { requestOtp } = useAuthStore.getState();

      // Tạo tên đầy đủ cho signup
      const fullName =
        isSignup && data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : undefined;

      // Gọi API requestOtp
      await requestOtp(data.identifier, fullName);

      console.log("✅ OTP request successful");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP");
      return;
    }
    try {
      await verifyOtp(otpValue);
      setIsOpen(false); // Close dialog on success
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error("OTP Verification failed", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="header" className="cursor-pointer">
          <User className="h-5 w-5 text-gray-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!otpSent ? (
          <form onSubmit={handleSubmit(onsubmit)}>
            <DialogHeader>
              <DialogTitle>Chào mừng bạn đến với Sport Shop</DialogTitle>
              <DialogDescription className="pb-2">
                {isSignup ? (
                  <>
                    Bạn đã có tài khoản?{" "}
                    <span
                      className="cursor-pointer underline underline-offset-4 hover:text-blue-400 "
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignup();
                      }}
                    >
                      Đăng nhập ngay!
                    </span>
                  </>
                ) : (
                  <>
                    Bạn chưa có tài khoản?{" "}
                    <span
                      className="cursor-pointer underline underline-offset-4 hover:text-blue-400"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSignup();
                      }}
                    >
                      Đăng ký ngay!
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="identifier">Email hoặc số điện thoại</Label>
                <Input
                  id="identifier"
                  {...register("identifier")}
                  placeholder="Nhập email hoặc số điện thoại của bạn"
                />
                {errors.identifier && (
                  <p className="text-red-500 text-sm">
                    {errors.identifier.message}
                  </p>
                )}
              </div>
              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="block text-sm">
                      Họ
                    </Label>
                    <Input
                      id="lastname"
                      {...register("lastName")}
                      type="text"
                      placeholder="Nguyen"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="block text-sm">
                      Tên
                    </Label>
                    <Input
                      id="firstname"
                      {...register("firstName")}
                      type="text"
                      placeholder="Van An"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-center pt-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi OTP"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Xác thực OTP</DialogTitle>
              <DialogDescription>
                Vui lòng nhập mã OTP 6 số đã được gửi đến email/SĐT của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setOtpSent(false)}
                disabled={loading}
              >
                Quay lại
              </Button>
              <Button onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Đang xác thực..." : "Xác thực"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthFormDialog;
