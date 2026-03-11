/**
 * HTTP客户端封装
 * 基于axios，包含认证拦截器和错误处理
 */

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';
import { ApiResponse } from '../types';
import { getStoredToken, clearStoredAuth } from '../utils/storage';

// API基础配置
const API_BASE_URL = 'http://192.168.0.1';
const API_TIMEOUT = 10000;
const MAX_RETRIES = 3;

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 网络错误自动重试
    if (!error.response && originalRequest._retry === undefined) {
      originalRequest._retry = 0;
    }

    if (!error.response && originalRequest._retry !== undefined && originalRequest._retry < MAX_RETRIES) {
      originalRequest._retry++;
      // 延迟重试，指数退避
      const delay = Math.pow(2, originalRequest._retry) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    // 处理特定错误码
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Token过期，清除认证信息
          await clearStoredAuth();
          // 触发重新登录事件
          globalEventEmitter.emit('auth:expired');
          break;
          
        case 403:
          console.error('权限不足');
          break;
          
        case 503:
          // 设备离线
          globalEventEmitter.emit('device:offline');
          break;
          
        default:
          console.error(`API错误: ${status}`, error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// 简单的事件发射器实现
class GlobalEventEmitter {
  private listeners: Map<string, Array<() => void>> = new Map();

  on(event: string, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  emit(event: string) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  }

  off(event: string, callback: () => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export const globalEventEmitter = new GlobalEventEmitter();

export default apiClient;
