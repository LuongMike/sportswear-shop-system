import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Mã OTP phải gồm 6 chữ số")
    .regex(/^\d+$/, "Mã OTP chỉ được chứa chữ số"),
});

type AuthOtpData = z.infer<typeof otpSchema>;

const AuthOtpDialog = ({ otpSent }: { otpSent?: boolean }) => {
  const [otpValue, setOtpValue] = useState("");
  const navigate = useNavigate();

  const { setOtpSent, setAccessToken, setUser, clearState } = useAuthStore();

  // Handle khi user đóng dialog
  const handleClose = () => {
    console.log("OTP dialog closed - resetting auth state");
    clearState(); // Reset về trạng thái ban đầu
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    setError,
  } = useForm<AuthOtpData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onsubmit = async (data: AuthOtpData) => {
    console.log("OTP submitted:", data);

    try {
      const { verifyOtp } = useAuthStore.getState();
      await verifyOtp(data.otp);
      
      // Navigate on success (handled in store)
      navigate("/");
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("otp", {
        type: "manual",
        message: "Mã OTP không đúng. Vui lòng thử lại.",
      });
    }
  };

  const handleOtpChange = async (value: string) => {
    setOtpValue(value);
    setValue("otp", value);

    // Tự động validate khi nhập đủ 6 số
    if (value.length === 6) {
      await trigger("otp");
    }
  };

  return (
    <Dialog
      open={otpSent}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="header" className="cursor-pointer">
          <User className="h-5 w-5 text-gray-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold">
            Nhập mã OTP
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến email hoặc số điện
            thoại của bạn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col items-center space-y-3">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={handleOtpChange}
                    className="flex justify-center"
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot
                        index={0}
                        className="w-12 h-12 text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-12 h-12 text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-12 h-12 text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-12 h-12 text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-12 h-12 text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-12 h-12 text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </InputOTPGroup>
                  </InputOTP>

                  {errors.otp && (
                    <p className="text-red-500 text-sm font-medium mt-2">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Nhập mã 6 chữ số đã được gửi đến email của bạn
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Không nhận được mã? </span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { resendOtp } = useAuthStore.getState();
                      await resendOtp();
                    } catch (error) {
                      console.error("Resend OTP error:", error);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all"
                >
                  Gửi lại
                </button>
              </p>
            </div>
          </div>

          <DialogFooter className="flex justify-center ">
            <div className="flex items-center max-w-xs">
              <Button
                type="submit"
                disabled={isSubmitting || otpValue.length !== 6}
                className=" bg-blue-600 hover:bg-blue-700"
              >
                Xác nhận OTP
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthOtpDialog;
