import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Quan trọng cho cookies
});

// Gắn access token vào header của mỗi request nếu có
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Tự động refresh token khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Những API không cần check refresh
    if (
      originalRequest.url?.includes("/auth/request-otp") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/resend-otp") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/forgot-password") ||
      originalRequest.url?.includes("/auth/reset-password")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    // Mock token: không thử refresh, tránh logout khi API 401
    const { accessToken } = useAuthStore.getState();
    const isMock =
      import.meta.env.DEV &&
      (await import("@/data/mockAuth")).isMockToken(accessToken);
    if (isMock) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;

      console.log(
        "Attempting refresh token, retry:",
        originalRequest._retryCount
      );
      try {
        const res = await api.post("/api/auth/refresh-token");

        if (res.data.success && res.data.accessToken) {
          const accessToken = res.data.accessToken;
          useAuthStore.getState().setAccessToken(accessToken);

          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Refresh token failed");
        }
      } catch (refreshError) {
        console.log("Refresh token failed, clearing auth state");
        const { accessToken } = useAuthStore.getState();
        const { isMockToken } = await import("@/data/mockAuth");
        useAuthStore.getState().clearState();
        // Không redirect khi đang dùng mock token (dev)
        if (!isMockToken(accessToken)) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
