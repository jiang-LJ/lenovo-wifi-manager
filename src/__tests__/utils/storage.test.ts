/**
 * 存储工具测试
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  encrypt,
  decrypt,
  storeToken,
  getStoredToken,
  clearStoredAuth,
  getConfig,
  saveConfig,
  storePassword,
  getStoredPassword,
  STORAGE_KEYS,
} from '../../utils/storage';

// Mock crypto-js
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn((text, key) => ({
      toString: () => `encrypted_${text}`,
    })),
    decrypt: jest.fn((cipherText, key) => ({
      toString: jest.fn(() => cipherText.replace('encrypted_', '')),
    })),
  },
  enc: {
    Utf8: 'Utf8',
  },
}));

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('encrypt/decrypt', () => {
    it('should encrypt text correctly', () => {
      const result = encrypt('test');
      expect(result).toBe('encrypted_test');
    });

    it('should decrypt text correctly', () => {
      const result = decrypt('encrypted_test');
      expect(result).toBe('test');
    });
  });

  describe('token management', () => {
    it('should store token with expiration', async () => {
      const token = 'test_token';
      const expiresIn = 3600;
      
      await storeToken(token, expiresIn);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TOKEN,
        token
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TOKEN_EXPIRES,
        expect.any(String)
      );
    });

    it('should get stored token when not expired', async () => {
      const token = 'test_token';
      const futureTime = Date.now() + 3600000;
      
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(futureTime.toString())
        .mockResolvedValueOnce(token);
      
      const result = await getStoredToken();
      
      expect(result).toBe(token);
    });

    it('should return null when token is expired', async () => {
      const pastTime = Date.now() - 3600000;
      
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(pastTime.toString());
      
      const result = await getStoredToken();
      
      expect(result).toBeNull();
    });

    it('should clear stored auth', async () => {
      await clearStoredAuth();
      
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRES,
      ]);
    });
  });

  describe('config management', () => {
    it('should get default config when none stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      
      const config = await getConfig();
      
      expect(config.deviceIp).toBe('192.168.0.1');
      expect(config.username).toBe('admin');
      expect(config.rememberPassword).toBe(false);
    });

    it('should merge stored config with defaults', async () => {
      const storedConfig = JSON.stringify({ username: 'custom_user' });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(storedConfig);
      
      const config = await getConfig();
      
      expect(config.username).toBe('custom_user');
      expect(config.deviceIp).toBe('192.168.0.1');
    });

    it('should save config', async () => {
      await saveConfig({ theme: 'dark' });
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('password management', () => {
    it('should store encrypted password', async () => {
      await storePassword('my_password');
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should get stored password', async () => {
      const encryptedPassword = 'encrypted_test';
      const config = JSON.stringify({ passwordEncrypted: encryptedPassword });
      
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(config);
      
      const result = await getStoredPassword();
      
      expect(result).toBe('test');
    });

    it('should return null when no password stored', async () => {
      const config = JSON.stringify({ passwordEncrypted: '' });
      
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(config);
      
      const result = await getStoredPassword();
      
      expect(result).toBeNull();
    });
  });
});
