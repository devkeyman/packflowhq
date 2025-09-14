// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "MANAGER" | "WORKER";

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

// 백엔드 실제 응답 구조
export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

// 프론트엔드에서 사용하는 구조 (기존 유지)
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  type: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  email: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
