/**
 * 认证 API 测试
 */

import { login, logout, checkSession, refreshToken } from '../../api/auth';
import apiClient from '../../api/client';

// Mock API client
jest.mock('../../api/client', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      const mockResponse = {
        data: {
          code: 200,
          data: {
            token: 'test_token',
            expiresIn: 3600,
            userInfo: { username: 'admin', role: 'admin' },
          },
        },
      };
      
      (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await login({
        username: 'admin',
        password: 'admin',
        remember: true,
      });

      expect(apiClient.post).toHaveBeenCalledWith('/api/login', {
        username: 'admin',
        password: 'admin',
        remember: true,
      });
      expect(result.token).toBe('test_token');
    });

    it('should throw error on login failure', async () => {
      const error = new Error('Invalid credentials');
      (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        login({ username: 'admin', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({});

      await logout();

      expect(apiClient.post).toHaveBeenCalledWith('/api/logout');
    });
  });

  describe('checkSession', () => {
    it('should return true for valid session', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { data: { valid: true } },
      });

      const result = await checkSession();

      expect(result).toBe(true);
    });

    it('should return false for invalid session', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { data: { valid: false } },
      });

      const result = await checkSession();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await checkSession();

      expect(result).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should return new token', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: { data: { token: 'new_token' } },
      });

      const result = await refreshToken();

      expect(result).toBe('new_token');
    });
  });
});
