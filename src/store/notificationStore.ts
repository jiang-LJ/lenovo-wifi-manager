/**
 * 通知状态管理
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from '../types';

interface NotificationState {
  // 状态
  notifications: AppNotification[];
  unreadCount: number;
  isEnabled: boolean;
  notifyPercent: number;

  // 动作
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  toggleNotifications: (enabled: boolean) => void;
  checkTrafficAlert: (currentTraffic: number, limit: number) => void;
  checkNewDevice: (deviceName: string, macAddress: string) => void;
  checkLowBattery: (batteryLevel: number) => void;
  checkFirmwareUpdate: (hasUpdate: boolean, version?: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // 初始状态
      notifications: [],
      unreadCount: 0,
      isEnabled: true,
      notifyPercent: 80,

      // 添加通知
      addNotification: (notification) => {
        const newNotification: AppNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, 100), // 最多保留100条
          unreadCount: state.unreadCount + 1,
        }));
      },

      // 标记为已读
      markAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      // 全部标记为已读
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      },

      // 删除通知
      removeNotification: (id: string) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === id);
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: notification?.isRead 
              ? state.unreadCount 
              : Math.max(0, state.unreadCount - 1),
          };
        });
      },

      // 清除所有通知
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      // 开关通知
      toggleNotifications: (enabled: boolean) => {
        set({ isEnabled: enabled });
      },

      // 检查流量预警
      checkTrafficAlert: (currentTraffic: number, limit: number) => {
        if (!get().isEnabled || limit <= 0) return;

        const percent = (currentTraffic / limit) * 100;
        const { notifyPercent } = get();

        if (percent >= 100) {
          get().addNotification({
            type: 'error',
            title: '流量超额',
            message: `今日流量已超出限额 ${formatFileSize(currentTraffic - limit)}`,
            action: { label: '查看详情', route: 'Traffic' },
          });
        } else if (percent >= notifyPercent) {
          get().addNotification({
            type: 'warning',
            title: '流量预警',
            message: `今日流量已使用 ${percent.toFixed(1)}%，接近限额`,
            action: { label: '查看详情', route: 'Traffic' },
          });
        }
      },

      // 新设备接入提醒
      checkNewDevice: (deviceName: string, macAddress: string) => {
        if (!get().isEnabled) return;

        get().addNotification({
          type: 'info',
          title: '新设备接入',
          message: `${deviceName} (${macAddress}) 已连接到网络`,
          action: { label: '查看设备', route: 'Devices' },
        });
      },

      // 电量低提醒
      checkLowBattery: (batteryLevel: number) => {
        if (!get().isEnabled) return;

        if (batteryLevel <= 20 && batteryLevel > 10) {
          get().addNotification({
            type: 'warning',
            title: '电量不足',
            message: `设备电量仅剩 ${batteryLevel}%，请及时充电`,
          });
        } else if (batteryLevel <= 10) {
          get().addNotification({
            type: 'error',
            title: '电量过低',
            message: `设备电量仅剩 ${batteryLevel}%，即将关机`,
          });
        }
      },

      // 固件更新提醒
      checkFirmwareUpdate: (hasUpdate: boolean, version?: string) => {
        if (!get().isEnabled || !hasUpdate) return;

        get().addNotification({
          type: 'info',
          title: '固件更新可用',
          message: `发现新版本 ${version}，建议及时更新`,
          action: { label: '立即更新', route: 'Settings' },
        });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50), // 只保留最近50条
        isEnabled: state.isEnabled,
      }),
    }
  )
);

// 辅助函数
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

export default useNotificationStore;
