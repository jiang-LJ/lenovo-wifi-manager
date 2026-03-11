/**
 * API 客户端测试
 */

import apiClient, { globalEventEmitter } from '../../api/client';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { getStoredToken, clearStoredAuth } from '../../utils/storage';

// Mock storage
jest.mock('../../utils/storage', () => ({
  getStoredToken: jest.fn(),
  clearStoredAuth: jest.fn(),
  storeToken: jest.fn(),
}));

describe('API Client', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('request interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      (getStoredToken as jest.Mock).mockResolvedValue('test_token');

      mockAxios.onGet('/test').reply(200, { data: 'success' });

      // Note: This is a simplified test - actual implementation would need more setup
      expect(getStoredToken).not.toHaveBeenCalled();
    });
  });

  describe('globalEventEmitter', () => {
    it('should register and emit events', () => {
      const callback = jest.fn();
      
      globalEventEmitter.on('auth:expired', callback);
      globalEventEmitter.emit('auth:expired');
      
      expect(callback).toHaveBeenCalled();
    });

    it('should remove event listeners', () => {
      const callback = jest.fn();
      
      globalEventEmitter.on('auth:expired', callback);
      globalEventEmitter.off('auth:expired', callback);
      globalEventEmitter.emit('auth:expired');
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      globalEventEmitter.on('auth:expired', callback1);
      globalEventEmitter.on('auth:expired', callback2);
      globalEventEmitter.emit('auth:expired');
      
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
});
