import apiClient from "./client";
import {
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  LogoutRequest,
} from "@/entities/user";

export const authApi = {
  // 로그인
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  // 토큰 갱신
  refresh: async (
    refreshToken: RefreshTokenRequest
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/refresh",
      refreshToken
    );
    return response.data;
  },

  // 로그아웃
  logout: async (logoutData: LogoutRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/auth/logout",
      logoutData
    );
    return response.data;
  },
};
