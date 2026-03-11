/**
 * 设置页面
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Card, Button } from '../components/common';
import { useAuthStore } from '../store/authStore';
import { useDeviceStore } from '../store/deviceStore';
import { getConfig, saveConfig, clearAllData, database } from '../utils';
import { AppConfig } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SettingsScreen: React.FC = () => {
  const { logout } = useAuthStore();
  const { deviceStatus } = useDeviceStore();
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const cfg = await getConfig();
    setConfig(cfg);
  };

  const updateConfig = async (updates: Partial<AppConfig>) => {
    await saveConfig(updates);
    setConfig(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: async () => {
            await database.clearAllData();
            Alert.alert('成功', '缓存已清除');
          },
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      '恢复出厂设置',
      '确定要恢复出厂设置吗？这将清除所有配置和数据。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await database.clearAllData();
            logout();
          },
        },
      ]
    );
  };

  const openDeviceWeb = () => {
    Linking.openURL('http://192.168.0.1');
  };

  if (!config) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 设备信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设备信息</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>固件版本</Text>
            <Text style={styles.infoValue}>{deviceStatus?.firmwareVersion || '--'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>管理地址</Text>
            <Text style={styles.infoValue}>192.168.0.1</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SSID</Text>
            <Text style={styles.infoValue}>{deviceStatus?.ssid || '--'}</Text>
          </View>
        </Card>
      </View>

      {/* 应用设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>应用设置</Text>
        <Card>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="theme-light-dark" size={20} color="#666" />
              <Text style={styles.settingText}>深色模式</Text>
            </View>
            <Switch
              value={config.theme === 'dark'}
              onValueChange={(value) =>
                updateConfig({ theme: value ? 'dark' : 'light' })
              }
              trackColor={{ false: '#DDD', true: '#E60012' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="lock-outline" size={20} color="#666" />
              <Text style={styles.settingText}>记住密码</Text>
            </View>
            <Switch
              value={config.rememberPassword}
              onValueChange={(value) =>
                updateConfig({ rememberPassword: value })
              }
              trackColor={{ false: '#DDD', true: '#E60012' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="login" size={20} color="#666" />
              <Text style={styles.settingText}>自动登录</Text>
            </View>
            <Switch
              value={config.autoLogin}
              onValueChange={(value) =>
                updateConfig({ autoLogin: value })
              }
              trackColor={{ false: '#DDD', true: '#E60012' }}
            />
          </View>
        </Card>
      </View>

      {/* 其他选项 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他</Text>
        <Card>
          <TouchableItem
            icon="web"
            text="访问Web管理页"
            onPress={openDeviceWeb}
          />
          <View style={styles.divider} />
          <TouchableItem
            icon="delete-outline"
            text="清除缓存"
            onPress={handleClearCache}
          />
          <View style={styles.divider} />
          <TouchableItem
            icon="restore"
            text="恢复出厂设置"
            onPress={handleReset}
            danger
          />
        </Card>
      </View>

      {/* 退出登录 */}
      <View style={styles.section}>
        <Button
          title="退出登录"
          variant="danger"
          onPress={handleLogout}
        />
      </View>

      {/* 版本信息 */}
      <Text style={styles.versionText}>联想WiFi管理 v1.0.0</Text>
    </ScrollView>
  );
};

interface TouchableItemProps {
  icon: string;
  text: string;
  onPress: () => void;
  danger?: boolean;
}

const TouchableItem: React.FC<TouchableItemProps> = ({
  icon,
  text,
  onPress,
  danger,
}) => (
  <TouchableOpacity style={styles.touchableItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <Icon name={icon} size={20} color={danger ? '#FF1744' : '#666'} />
      <Text style={[styles.settingText, danger && styles.dangerText]}>
        {text}
      </Text>
    </View>
    <Icon name="chevron-right" size={20} color="#CCC" />
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  touchableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dangerText: {
    color: '#FF1744',
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default SettingsScreen;
