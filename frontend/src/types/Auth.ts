import type { User } from "./User";

// Kiểu dữ liệu xác định người dùng (email hoặc phone)
export type Identifier = { type: "email" | "phone"; value: string };

// Request OTP Response
export interface RequestOtpResponse {
  success: boolean;
  message: string;
  otpToken?: string;
  expiresAt?: string;
  error?: string;
}

// Verify OTP Response
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  error?: string;
}

// Resend OTP Response
export interface ResendOtpResponse {
  success: boolean;
  message: string;
  otpToken?: string;
  expiresAt?: string;
  error?: string;
}

// Login with email/password Response
export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: import("./User").User;
  accessToken?: string;
  error?: string;
}

// Forgot Password Response
export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Reset Password Response
export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Register Response
export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: import("./User").User;
  accessToken?: string;
  error?: string;
}

// Refresh Token Response
export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
  error?: string;
}

// User Info Response
export interface UserInfoResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}
