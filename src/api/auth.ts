/**
 * 认证相关API
 */

import apiClient from './client';
import { ApiResponse, LoginResponse } from '../types';

export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 用户登录
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/login', params);
  return response.data.data;
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  await apiClient.post<ApiResponse<void>>('/api/logout');
};

/**
 * 检查会话是否有效
 */
export const checkSession = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<ApiResponse<{ valid: boolean }>>('/api/session/check');
    return response.data.data.valid;
  } catch {
    return false;
  }
};

/**
 * 刷新Token
 */
export const refreshToken = async (): Promise<string> => {
  const response = await apiClient.post<ApiResponse<{ token: string }>>('/api/token/refresh');
  return response.data.data.token;
};
