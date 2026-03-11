/**
 * 主题管理Hook
 */

import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors } from '../types';
import { getConfig, saveConfig } from '../utils/storage';

// 联想品牌色彩规范
const lightColors: ThemeColors = {
  primary: '#E60012',
  secondary: '#00C853',
  success: '#00C853',
  warning: '#FFD600',
  error: '#FF1744',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
  divider: '#EEEEEE',
};

const darkColors: ThemeColors = {
  primary: '#E60012',
  secondary: '#00C853',
  success: '#00C853',
  warning: '#FFD600',
  error: '#FF1744',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  divider: '#2A2A2A',
};

export type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const config = await getConfig();
      setThemeMode(config.theme);
    } catch (error) {
      console.error('加载主题设置失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await saveConfig({ theme: mode });
  };

  const colors = (() => {
    const effectiveMode = themeMode === 'system' 
      ? (systemColorScheme || 'light') 
      : themeMode;
    return effectiveMode === 'dark' ? darkColors : lightColors;
  })();

  const isDark = colors === darkColors;

  return {
    colors,
    themeMode,
    setTheme,
    isDark,
    isLoading,
  };
};

export default useTheme;
