/**
 * 认证状态管理
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, logout as logoutApi, LoginParams } from '../api/auth';
import { 
  storeToken, 
  clearStoredAuth, 
  storePassword, 
  saveConfig 
} from '../utils/storage';

interface AuthState {
  // 状态
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string; role: string } | null;
  error: string | null;
  loginAttempts: number;
  lockUntil: number | null;

  // 动作
  login: (params: LoginParams) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkLockStatus: () => boolean;
  resetLock: () => void;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION = 30 * 1000; // 30秒

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
      loginAttempts: 0,
      lockUntil: null,

      // 检查是否被锁定
      checkLockStatus: () => {
        const { lockUntil } = get();
        if (lockUntil && Date.now() < lockUntil) {
          return true;
        }
        if (lockUntil && Date.now() >= lockUntil) {
          set({ lockUntil: null, loginAttempts: 0 });
        }
        return false;
      },

      // 重置锁定
      resetLock: () => {
        set({ lockUntil: null, loginAttempts: 0 });
      },

      // 登录
      login: async (params: LoginParams) => {
        const { checkLockStatus, loginAttempts } = get();
        
        // 检查是否被锁定
        if (checkLockStatus()) {
          const remainingTime = Math.ceil((get().lockUntil! - Date.now()) / 1000);
          set({ error: `登录过于频繁，请${remainingTime}秒后重试` });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await loginApi(params);
          
          // 存储token
          await storeToken(response.token, response.expiresIn);
          
          // 如果选择了记住密码，加密存储
          if (params.remember) {
            await storePassword(params.password);
            await saveConfig({ 
              rememberPassword: true,
              username: params.username 
            });
          }

          // 重置登录尝试次数
          set({
            isAuthenticated: true,
            user: response.userInfo,
            isLoading: false,
            loginAttempts: 0,
            error: null,
          });

          return true;
        } catch (error: any) {
          const newAttempts = loginAttempts + 1;
          const updates: Partial<AuthState> = {
            isLoading: false,
            loginAttempts: newAttempts,
          };

          // 超过最大尝试次数，锁定账户
          if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            updates.lockUntil = Date.now() + LOCK_DURATION;
            updates.error = `登录失败次数过多，请30秒后重试`;
          } else {
            updates.error = error?.response?.data?.message || '登录失败，请检查用户名和密码';
          }

          set(updates);
          return false;
        }
      },

      // 登出
      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutApi();
        } catch (error) {
          console.error('登出失败:', error);
        } finally {
          await clearStoredAuth();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
            loginAttempts: 0,
            lockUntil: null,
          });
        }
      },

      // 清除错误
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        loginAttempts: state.loginAttempts,
        lockUntil: state.lockUntil,
      }),
    }
  )
);

export default useAuthStore;
