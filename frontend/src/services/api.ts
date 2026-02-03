import api from "@/lib/axios";
import type {
  RequestOtpResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  RefreshTokenResponse,
  UserInfoResponse,
} from "@/types/Auth";

export class AuthAPI {
  // Request OTP cho signup/signin
  static async requestOtp(
    identifier: string,
    full_name?: string
  ): Promise<RequestOtpResponse> {
    const payload: { identifier: string; full_name?: string } = { identifier };
    if (full_name) payload.full_name = full_name;

    const response = await api.post("/api/auth/request-otp", payload);
    return response.data;
  }

  // Verify OTP
  static async verifyOtp(
    otpToken: string,
    otpCode: string
  ): Promise<VerifyOtpResponse> {
    const response = await api.post("/api/auth/verify-otp", {
      otpToken,
      otpCode,
    });
    return response.data;
  }

  // Resend OTP
  static async resendOtp(otpToken: string): Promise<ResendOtpResponse> {
    const response = await api.post("/api/auth/resend-otp", { otpToken });
    return response.data;
  }

  // Refresh access token
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await api.post("/api/auth/refresh-token");
    return response.data;
  }

  // Get current user
  static async getCurrentUser(): Promise<UserInfoResponse> {
    const response = await api.get("/api/auth/me");
    return response.data;
  }

  // Logout
  static async logout(): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/api/auth/logout");
    return response.data;
  }

  // Logout from all devices
  static async logoutAll(): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/api/auth/logout-all");
    return response.data;
  }

  // Check OTP status
  static async checkOtpStatus(userId: string, identifier: string) {
    const response = await api.post("/api/auth/check-otp-status", {
      userId,
      identifier,
    });
    return response.data;
  }
}

export default AuthAPI;
