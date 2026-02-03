import type { User } from "@/types/User";

/**
 * Tài khoản ảo để test khi chưa có backend
 * Chỉ hoạt động trong môi trường development (npm run dev)
 */

export const MOCK_CREDENTIALS = {
  email: "test@sportshop.vn",
  password: "Test123!",
};

export const MOCK_USER: User = {
  _id: "mock-user-001",
  full_name: "Nguyễn Văn Test",
  email: "test@sportshop.vn",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  avatarUrl: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_ACCESS_TOKEN = "mock-access-token-for-dev";

/**
 * Kiểm tra token có phải mock token không
 */
export function isMockToken(token: string | null): boolean {
  return token === MOCK_ACCESS_TOKEN;
}

/**
 * Kiểm tra credentials có khớp tài khoản test không
 */
export function isMockCredentials(
  email: string,
  password: string
): boolean {
  return (
    email.toLowerCase().trim() === MOCK_CREDENTIALS.email &&
    password === MOCK_CREDENTIALS.password
  );
}
