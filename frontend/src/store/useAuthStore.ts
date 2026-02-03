import type { AuthState } from "@/types/store";
import type {
  RequestOtpResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from "@/types/Auth";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      // OTP state
      currentIdentifier: null,
      otpToken: null,
      otpSent: false,
      otpExpiresAt: null,

      setAccessToken: (token: string) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      setOtpSent: (otpSent: boolean) => set({ otpSent }),
      setOtpToken: (token: string | null) => set({ otpToken: token }),

      // Đăng nhập bằng email và mật khẩu
      loginWithEmailPassword: async (
        email: string,
        password: string,
      ): Promise<LoginResponse> => {
        set({ loading: true });

        try {
          const res = await api.post("/api/auth/login", { email, password });
          const data: LoginResponse = res.data;

          if (data.success && data.accessToken && data.user) {
            set({
              accessToken: data.accessToken,
              user: data.user,
              loading: false,
            });
            toast.success("Đăng nhập thành công!");
          }

          return data;
        } catch (error: unknown) {
          // Chỉ dùng tài khoản ảo khi API lỗi
          const { isMockCredentials, MOCK_USER, MOCK_ACCESS_TOKEN } =
            await import("@/data/mockAuth");
          if (isMockCredentials(email, password)) {
            set({
              accessToken: MOCK_ACCESS_TOKEN,
              user: MOCK_USER,
              loading: false,
            });

            toast.success("Đăng nhập thành công! (Dùng dữ liệu demo)");
            return {
              success: true,
              accessToken: MOCK_ACCESS_TOKEN,
              user: MOCK_USER,
            };
          }
          const err = error as { response?: { data?: { message?: string } } };
          const message =
            err?.response?.data?.message || "Email hoặc mật khẩu không đúng";
          toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Đăng ký tài khoản mới
      registerWithEmail: async (data: {
        email: string;
        password: string;
        full_name: string;
      }): Promise<RegisterResponse> => {
        set({ loading: true });

        try {
          const res = await api.post("/api/auth/register", data);
          const response: RegisterResponse = res.data;

          if (response.success && response.accessToken && response.user) {
            set({
              accessToken: response.accessToken,
              user: response.user,
              loading: false,
            });
            toast.success("Đăng ký thành công!");
          } else if (response.success) {
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
          }

          return response;
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          const message =
            err?.response?.data?.message || "Không thể đăng ký tài khoản";
          toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Yêu cầu đặt lại mật khẩu (gửi email)
      requestPasswordReset: async (
        email: string,
      ): Promise<ForgotPasswordResponse> => {
        set({ loading: true });

        try {
          const res = await api.post("/api/auth/forgot-password", { email });
          const data: ForgotPasswordResponse = res.data;

          if (data.success) {
            toast.success(
              "Đã gửi link đặt lại mật khẩu! Vui lòng kiểm tra email.",
            );
          }

          return data;
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          const message =
            err?.response?.data?.message ||
            "Không thể gửi email đặt lại mật khẩu";
          toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Đặt lại mật khẩu mới (với token từ email)
      resetPassword: async (
        token: string,
        newPassword: string,
      ): Promise<ResetPasswordResponse> => {
        set({ loading: true });

        try {
          const res = await api.post("/api/auth/reset-password", {
            token,
            newPassword,
          });
          const data: ResetPasswordResponse = res.data;

          if (data.success) {
            toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
          }

          return data;
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          const message =
            err?.response?.data?.message ||
            "Không thể đặt lại mật khẩu. Link có thể đã hết hạn.";
          toast.error(message);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          currentIdentifier: null,
          otpToken: null,
          otpSent: false,
          otpExpiresAt: null,
          loading: false,
        });

        try {
          localStorage.removeItem("auth-storage");
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("auth")) {
              localStorage.removeItem(key);
            }
          });
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }
      },

      // Request OTP cho cả signup và signin
      requestOtp: async (
        identifier: string,
        full_name?: string,
      ): Promise<RequestOtpResponse> => {
        set({ loading: true });

        try {
          const payload: { identifier: string; full_name?: string } = {
            identifier,
          };
          if (full_name) {
            payload.full_name = full_name;
          }

          const res = await api.post("/api/auth/request-otp", payload);
          const data: RequestOtpResponse = res.data;

          if (data.success && data.otpToken) {
            set({
              currentIdentifier: identifier,
              otpToken: data.otpToken,
              otpSent: true,
              otpExpiresAt: data.expiresAt || null,
            });

            const actionType = full_name ? "Đăng ký" : "Đăng nhập";
            toast.success(`${actionType} thành công! Vui lòng kiểm tra OTP.`);
          }

          return data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Verify OTP
      verifyOtp: async (otpCode: string): Promise<VerifyOtpResponse> => {
        const { otpToken } = get();

        if (!otpToken) {
          throw new Error("Không tìm thấy OTP token");
        }

        set({ loading: true });

        try {
          const payload = {
            otpToken,
            otpCode,
          };

          const res = await api.post("/api/auth/verify-otp", payload);
          const data: VerifyOtpResponse = res.data;

          if (data.success && data.accessToken && data.user) {
            set({
              accessToken: data.accessToken,
              user: data.user,
              otpSent: false,
              otpToken: null,
              currentIdentifier: null,
              otpExpiresAt: null,
            });

            toast.success("Xác thực thành công!");
          }
          console.log(data);

          return data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Xác thực OTP thất bại";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Resend OTP
      resendOtp: async (): Promise<ResendOtpResponse> => {
        const { otpToken } = get();

        if (!otpToken) {
          throw new Error("Không tìm thấy OTP token");
        }

        set({ loading: true });

        try {
          const res = await api.post("/api/auth/resend-otp", { otpToken });
          const data: ResendOtpResponse = res.data;

          if (data.success && data.otpToken) {
            set({
              otpToken: data.otpToken,
              otpExpiresAt: data.expiresAt || null,
            });

            toast.success("Đã gửi lại mã OTP!");
          }

          return data;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Không thể gửi lại OTP";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Refresh access token
      refreshToken: async (): Promise<void> => {
        try {
          const res = await api.post("/api/auth/refresh-token");

          if (res.data.success && res.data.accessToken) {
            set({ accessToken: res.data.accessToken });
          } else {
            throw new Error("Refresh token failed");
          }
        } catch (error) {
          console.error("Refresh token error:", error);
          get().clearState();
          throw error;
        }
      },

      // Get current user info
      getCurrentUser: async (): Promise<void> => {
        try {
          const res = await api.get("/api/auth/me");

          if (res.data.success && res.data.user) {
            set({ user: res.data.user });
          }
        } catch (error: any) {
          console.error("Get current user error:", error);
          // Nếu là lỗi 401 hoặc 403, có thể token đã expired
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            throw error; // Throw để initializeAuth có thể handle refresh
          }
          // Các lỗi khác (network, server), không throw
        }
      },

      // Logout
      logout: async (): Promise<void> => {
        const { accessToken } = get();
        const { isMockToken } = await import("@/data/mockAuth");

        if (!isMockToken(accessToken)) {
          try {
            await api.post("/api/auth/logout");
            toast.success("Đăng xuất thành công!");
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
        get().clearState();
      },

      // Initialize auth on app startup
      initializeAuth: async (): Promise<void> => {
        const { accessToken, user } = get();
        const { isMockToken } = await import("@/data/mockAuth");

        console.log("🔄 Initializing auth...", {
          hasToken: !!accessToken,
          hasUser: !!user,
          isMock: isMockToken(accessToken),
        });

        // Mock token: giữ nguyên state, không gọi API
        if (import.meta.env.DEV && isMockToken(accessToken) && user) {
          console.log("✅ Mock user session restored");
          return;
        }

        // Nếu không có user hoặc token, thử refresh
        if (!accessToken || !user) {
          console.log("🔄 No access token or user, trying to refresh...");
          try {
            await get().refreshToken();
            // Nếu refresh thành công, lấy thông tin user
            await get().getCurrentUser();
            console.log("✅ Auth initialized successfully via refresh");
          } catch (error) {
            console.log("❌ Auth initialization failed, clearing state");
            get().clearState();
          }
        } else {
          // Nếu có token, verify bằng cách lấy thông tin user
          console.log("🔄 Verifying existing token...");
          try {
            await get().getCurrentUser();
            console.log("✅ Existing token verified");
          } catch (error) {
            console.log("❌ Token verification failed, trying refresh...");
            try {
              await get().refreshToken();
              await get().getCurrentUser();
              console.log("✅ Auth recovered via refresh");
            } catch (refreshError) {
              console.log("❌ Auth recovery failed, clearing state");
              get().clearState();
            }
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
