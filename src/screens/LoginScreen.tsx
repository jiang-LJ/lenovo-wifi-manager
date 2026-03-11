/**
 * 登录页面
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Button, Input, Card, Loading } from '../components/common';
import { useAuthStore } from '../store/authStore';
import { getConfig, getStoredPassword } from '../utils/storage';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);

  const { login, isLoading, error, loginAttempts, lockUntil, checkLockStatus } = useAuthStore();

  // 加载保存的配置
  useEffect(() => {
    loadSavedConfig();
  }, []);

  const loadSavedConfig = async () => {
    const config = await getConfig();
    setUsername(config.username || 'admin');
    setRememberPassword(config.rememberPassword);
    setAutoLogin(config.autoLogin);

    // 如果设置了记住密码，填充密码
    let savedPassword: string | null = null;
    if (config.rememberPassword) {
      savedPassword = await getStoredPassword();
      if (savedPassword) {
        setPassword(savedPassword);
      }
    }

    // 如果设置了自动登录，尝试登录
    if (config.autoLogin && savedPassword) {
      setIsAutoLoggingIn(true);
      await login({
        username: config.username || 'admin',
        password: savedPassword,
        remember: true,
      });
      setIsAutoLoggingIn(false);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }

    await login({
      username: username.trim(),
      password: password.trim(),
      remember: rememberPassword,
    });
  };

  const isLocked = checkLockStatus();
  const lockRemainingTime = lockUntil 
    ? Math.ceil((lockUntil - Date.now()) / 1000) 
    : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>L</Text>
          </View>
          <Text style={styles.appName}>联想WiFi管理</Text>
          <Text style={styles.subtitle}>设备管理地址: 192.168.0.1</Text>
        </View>

        <Card style={styles.formCard}>
          <Text style={styles.title}>账号登录</Text>

          {isLocked && (
            <View style={styles.lockBanner}>
              <Text style={styles.lockText}>
                登录过于频繁，请{lockRemainingTime}秒后重试
              </Text>
            </View>
          )}

          {error && !isLocked && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="用户名"
            value={username}
            onChangeText={setUsername}
            placeholder="请输入用户名"
            autoCapitalize="none"
            editable={!isLoading && !isLocked}
          />

          <Input
            label="密码"
            value={password}
            onChangeText={setPassword}
            placeholder="请输入密码"
            secureTextEntry
            editable={!isLoading && !isLocked}
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => !isLoading && setRememberPassword(!rememberPassword)}
            >
              <View style={[styles.checkbox, rememberPassword && styles.checkboxChecked]}>
                {rememberPassword && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>记住密码</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => !isLoading && setAutoLogin(!autoLogin)}
            >
              <View style={[styles.checkbox, autoLogin && styles.checkboxChecked]}>
                {autoLogin && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>自动登录</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="登 录"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || isLocked || !username.trim() || !password.trim()}
            size="large"
          />

          {loginAttempts > 0 && (
            <Text style={styles.attemptText}>
              登录失败 {loginAttempts} 次，{5 - loginAttempts} 次后将锁定30秒
            </Text>
          )}
        </Card>

        <Text style={styles.footerText}>
          默认用户名: admin | 默认密码: admin
        </Text>
      </ScrollView>

      <Loading visible={isAutoLoggingIn} text="自动登录中..." />
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E60012',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  formCard: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  lockBanner: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  lockText: {
    color: '#FFA000',
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF1744',
    fontSize: 14,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E60012',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#E60012',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
  },
  attemptText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
