import request from "@/utils/request";
import type { ApiResponse, User } from "@/types/home";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface TokenResponse {
  token: string;
  user: UserInfo;
}

/**
 * 用户登录
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // 模拟 API 调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟验证
      if (
        payload.email === "test@example.com" &&
        payload.password === "123456"
      ) {
        resolve({
          user: {
            id: 1,
            email: payload.email,
            nickname: "Test User",
            avatar: "https://via.placeholder.com/100",
            createdAt: "2024-01-01",
          },
          token: "mock_token_" + Date.now(),
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
}

/**
 * 用户注册
 */
export function register(data: RegisterParams) {
  return request.post<any, ApiResponse<TokenResponse>>("/auth/register", data);
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return request.get<any, ApiResponse<UserInfo>>("/auth/me");
}

/**
 * 发送重置密码邮件
 */
export function sendResetPasswordEmail(email: string) {
  return request.post<any, ApiResponse<null>>("/auth/forgot-password", {
    email,
  });
}

/**
 * 重置密码
 */
export function resetPassword(token: string, password: string) {
  return request.post<any, ApiResponse<null>>("/auth/reset-password", {
    token,
    password,
  });
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>) {
  return request.put<any, ApiResponse<UserInfo>>("/auth/me", data);
}

/**
 * 更改密码
 */
export function changePassword(oldPassword: string, newPassword: string) {
  return request.put<any, ApiResponse<null>>("/auth/password", {
    oldPassword,
    newPassword,
  });
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  return request.post<any, ApiResponse<{ url: string }>>(
    "/auth/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

// 第三方登录
export async function socialLogin(provider: string): Promise<AuthResponse> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: 2,
          email: `${provider}@example.com`,
          nickname: `${provider} User`,
          avatar: "https://via.placeholder.com/100",
          createdAt: "2024-01-01",
        },
        token: `mock_${provider}_token_` + Date.now(),
      });
    }, 1000);
  });
}

// 验证 token
export async function validateToken(token: string): Promise<boolean> {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(token.startsWith("mock_"));
    }, 500);
  });
}

// 获取用户信息
export async function getUserInfo(token: string): Promise<User> {
  // 模拟 API 调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token.startsWith("mock_")) {
        resolve({
          id: 1,
          email: "test@example.com",
          nickname: "Test User",
          avatar: "https://via.placeholder.com/100",
          createdAt: "2024-01-01",
        });
      } else {
        reject(new Error("Invalid token"));
      }
    }, 500);
  });
}
