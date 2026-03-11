/**
 * 认证状态管理测试
 */

import { useAuthStore } from '../../store/authStore';
import { login as loginApi } from '../../api/auth';
import { storeToken, clearStoredAuth, storePassword, saveConfig } from '../../utils/storage';

// Mock dependencies
jest.mock('../../api/auth');
jest.mock('../../utils/storage');

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
      loginAttempts: 0,
      lockUntil: null,
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();
      
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
      expect(state.loginAttempts).toBe(0);
      expect(state.lockUntil).toBeNull();
    });
  });

  describe('checkLockStatus', () => {
    it('should return false when not locked', () => {
      const result = useAuthStore.getState().checkLockStatus();
      expect(result).toBe(false);
    });

    it('should return true when locked', () => {
      useAuthStore.setState({ lockUntil: Date.now() + 30000 });
      const result = useAuthStore.getState().checkLockStatus();
      expect(result).toBe(true);
    });

    it('should reset lock when lock time expired', () => {
      useAuthStore.setState({ lockUntil: Date.now() - 1000 });
      const result = useAuthStore.getState().checkLockStatus();
      expect(result).toBe(false);
      expect(useAuthStore.getState().lockUntil).toBeNull();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockLoginResponse = {
        token: 'test_token',
        expiresIn: 3600,
        userInfo: { username: 'admin', role: 'admin' },
      };
      (loginApi as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

      const result = await useAuthStore.getState().login({
        username: 'admin',
        password: 'admin',
        remember: true,
      });

      expect(result).toBe(true);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toEqual(mockLoginResponse.userInfo);
      expect(storeToken).toHaveBeenCalledWith('test_token', 3600);
      expect(storePassword).toHaveBeenCalledWith('admin');
    });

    it('should handle login failure', async () => {
      (loginApi as jest.Mock).mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } },
      });

      const result = await useAuthStore.getState().login({
        username: 'admin',
        password: 'wrong',
      });

      expect(result).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().loginAttempts).toBe(1);
      expect(useAuthStore.getState().error).toBe('Invalid credentials');
    });

    it('should lock after 5 failed attempts', async () => {
      (loginApi as jest.Mock).mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      });

      // Attempt login 5 times
      for (let i = 0; i < 5; i++) {
        await useAuthStore.getState().login({
          username: 'admin',
          password: 'wrong',
        });
      }

      expect(useAuthStore.getState().lockUntil).not.toBeNull();
      expect(useAuthStore.getState().error).toContain('30秒后重试');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Set authenticated state first
      useAuthStore.setState({
        isAuthenticated: true,
        user: { username: 'admin', role: 'admin' },
      });

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
      expect(clearStoredAuth).toHaveBeenCalled();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useAuthStore.setState({ error: 'Some error' });
      
      useAuthStore.getState().clearError();
      
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('resetLock', () => {
    it('should reset lock state', () => {
      useAuthStore.setState({
        lockUntil: Date.now() + 30000,
        loginAttempts: 3,
      });
      
      useAuthStore.getState().resetLock();
      
      expect(useAuthStore.getState().lockUntil).toBeNull();
      expect(useAuthStore.getState().loginAttempts).toBe(0);
    });
  });
});
