/**
 * 本地存储工具
 * 封装AsyncStorage，提供类型安全和加密支持
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { AppConfig } from '../types';

// 存储键名
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  TOKEN_EXPIRES: 'token_expires',
  CONFIG: 'app_config',
  DEVICE_CACHE: 'device_cache',
  TRAFFIC_CACHE: 'traffic_cache',
  NOTIFICATIONS: 'notifications',
  FIRST_LAUNCH: 'first_launch',
} as const;

// 加密密钥（实际项目中应该从设备唯一标识派生）
const getEncryptionKey = (): string => {
  // 使用固定的密钥，实际项目中应该使用设备唯一标识
  return 'lenovo-wifi-manager-secret-key-2024';
};

/**
 * AES加密
 */
export const encrypt = (text: string): string => {
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(text, key).toString();
};

/**
 * AES解密
 */
export const decrypt = (cipherText: string): string => {
  const key = getEncryptionKey();
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// ==================== Token存储 ====================

export const storeToken = async (token: string, expiresIn: number): Promise<void> => {
  const expiresAt = Date.now() + expiresIn * 1000;
  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES, expiresAt.toString());
};

export const getStoredToken = async (): Promise<string | null> => {
  const expiresAt = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES);
  if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
    // Token已过期
    await clearStoredAuth();
    return null;
  }
  return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const clearStoredAuth = async (): Promise<void> => {
  await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.TOKEN_EXPIRES]);
};

// ==================== 配置存储 ====================

const DEFAULT_CONFIG: AppConfig = {
  deviceIp: '192.168.0.1',
  username: 'admin',
  passwordEncrypted: '',
  rememberPassword: false,
  autoLogin: false,
  theme: 'system',
  language: 'zh-CN',
};

export const getConfig = async (): Promise<AppConfig> => {
  const configStr = await AsyncStorage.getItem(STORAGE_KEYS.CONFIG);
  if (configStr) {
    return { ...DEFAULT_CONFIG, ...JSON.parse(configStr) };
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = async (config: Partial<AppConfig>): Promise<void> => {
  const currentConfig = await getConfig();
  const newConfig = { ...currentConfig, ...config };
  await AsyncStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(newConfig));
};

export const storePassword = async (password: string): Promise<void> => {
  const encrypted = encrypt(password);
  await saveConfig({ passwordEncrypted: encrypted });
};

export const getStoredPassword = async (): Promise<string | null> => {
  const config = await getConfig();
  if (config.passwordEncrypted) {
    try {
      return decrypt(config.passwordEncrypted);
    } catch {
      return null;
    }
  }
  return null;
};

// ==================== 通用存储方法 ====================

export const storeData = async <T>(key: string, value: T): Promise<void> => {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonValue);
};

export const getData = async <T>(key: string): Promise<T | null> => {
  const jsonValue = await AsyncStorage.getItem(key);
  if (jsonValue) {
    return JSON.parse(jsonValue) as T;
  }
  return null;
};

export const removeData = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

// ==================== 首次启动 ====================

export const isFirstLaunch = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
  return value === null;
};

export const setFirstLaunchComplete = async (): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'false');
};

// ==================== 清除所有数据 ====================

export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.clear();
};

export { STORAGE_KEYS };
