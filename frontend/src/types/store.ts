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
  user: User | null;
  loading: boolean;

  // OTP state
  currentIdentifier: string | null;
  otpToken: string | null;
  otpSent: boolean;
  otpExpiresAt: string | null;

  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setOtpSent: (otpSent: boolean) => void;
  setOtpToken: (token: string | null) => void;
  clearState: () => void;

  // Auth actions
  loginWithEmailPassword: (
    email: string,
    password: string
  ) => Promise<LoginResponse>;
  registerWithEmail: (data: {
    email: string;
    password: string;
    full_name: string;
  }) => Promise<RegisterResponse>;
  requestPasswordReset: (email: string) => Promise<ForgotPasswordResponse>;
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<ResetPasswordResponse>;
  requestOtp: (
    identifier: string,
    full_name?: string
  ) => Promise<RequestOtpResponse>;
  verifyOtp: (otpCode: string) => Promise<VerifyOtpResponse>;
  resendOtp: () => Promise<ResendOtpResponse>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}
