import type { User } from "./User";
import type {
  RequestOtpResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from "./Auth";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null; // Dữ liệu chuỗi token
  user: any | null; 
  loading: boolean;

  // OTP state
  currentIdentifier: string | null;
  otpToken: string | null;
  otpSent: boolean;
  otpExpiresAt: string | null;

  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: any) => void;
  setOtpSent: (otpSent: boolean) => void;
  setOtpToken: (token: string | null) => void;
  clearState: () => void;

  // Auth actions
  loginWithEmailPassword: (email: string, password: string) => Promise<any>;
  registerWithEmail: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  
  // Đổi tên hàm thành refreshAuth để tránh trùng với biến refreshToken ở trên
  refreshAuth: () => Promise<void>; 
}