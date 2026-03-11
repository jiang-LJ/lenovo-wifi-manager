/**
 * 联想无线WiFi管理应用
 * 主入口文件
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { AppNavigator } from './src/navigation/AppNavigator';
import { database } from './src/utils/database';
import { globalEventEmitter } from './src/api/client';
import { useAuthStore } from './src/store/authStore';

// 忽略特定警告
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// 主题配置
const theme = {
  colors: {
    primary: '#E60012',
    accent: '#00C853',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    disabled: '#999999',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

const App: React.FC = () => {
  // 初始化数据库
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await database.init();
        console.log('数据库初始化成功');
      } catch (error) {
        console.error('数据库初始化失败:', error);
      }
    };

    initDatabase();

    return () => {
      database.close();
    };
  }, []);

  // 监听认证过期事件
  useEffect(() => {
    const handleAuthExpired = () => {
      const { logout } = useAuthStore.getState();
      logout();
    };

    globalEventEmitter.on('auth:expired', handleAuthExpired);

    return () => {
      globalEventEmitter.off('auth:expired', handleAuthExpired);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#E60012"
        />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
