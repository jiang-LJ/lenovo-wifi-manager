/**
 * 设备状态管理
 */

import { create } from 'zustand';
import { DeviceStatus, ClientDevice } from '../types';
import { 
  getDeviceStatus as getDeviceStatusApi,
  getClientList as getClientListApi,
  getBatteryInfo as getBatteryInfoApi,
  updateClientName as updateClientNameApi,
  setClientSpeedLimit as setClientSpeedLimitApi,
  setClientBlock as setClientBlockApi,
  setClientPriority as setClientPriorityApi,
  kickClient as kickClientApi,
} from '../api/device';

interface DeviceState {
  // 状态
  deviceStatus: DeviceStatus | null;
  clientList: ClientDevice[];
  batteryInfo: { level: number; isCharging: boolean } | null;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';

  // 动作
  fetchDeviceStatus: () => Promise<void>;
  fetchClientList: () => Promise<void>;
  fetchBatteryInfo: () => Promise<void>;
  syncAllData: () => Promise<void>;
  updateClientName: (clientId: string, name: string) => Promise<void>;
  setClientSpeedLimit: (clientId: string, speedLimit: number) => Promise<void>;
  blockClient: (clientId: string) => Promise<void>;
  unblockClient: (clientId: string) => Promise<void>;
  setClientPriority: (clientId: string, priority: 'high' | 'normal' | 'low') => Promise<void>;
  kickClient: (clientId: string) => Promise<void>;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void;
  clearError: () => void;
}

export const useDeviceStore = create<DeviceState>((set, get) => ({
  // 初始状态
  deviceStatus: null,
  clientList: [],
  batteryInfo: null,
  isLoading: false,
  error: null,
  lastSyncTime: null,
  connectionStatus: 'disconnected',

  // 获取设备状态
  fetchDeviceStatus: async () => {
    try {
      const status = await getDeviceStatusApi();
      set({ 
        deviceStatus: status, 
        connectionStatus: 'connected',
        lastSyncTime: new Date().toISOString(),
      });
    } catch (error: any) {
      set({ 
        connectionStatus: 'disconnected',
        error: error?.message || '获取设备状态失败'
      });
    }
  },

  // 获取客户端列表
  fetchClientList: async () => {
    try {
      const clients = await getClientListApi();
      set({ clientList: clients });
    } catch (error: any) {
      set({ error: error?.message || '获取设备列表失败' });
    }
  },

  // 获取电量信息
  fetchBatteryInfo: async () => {
    try {
      const battery = await getBatteryInfoApi();
      set({ batteryInfo: battery });
    } catch (error) {
      // 电量信息可能不支持，不设置错误
      console.log('获取电量信息失败，设备可能不支持');
    }
  },

  // 同步所有数据
  syncAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchDeviceStatus(),
        get().fetchClientList(),
        get().fetchBatteryInfo(),
      ]);
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error?.message || '同步数据失败'
      });
    }
  },

  // 更新客户端名称
  updateClientName: async (clientId: string, name: string) => {
    set({ isLoading: true });
    try {
      await updateClientNameApi(clientId, name);
      // 更新本地状态
      const { clientList } = get();
      const updatedList = clientList.map(client =>
        client.id === clientId ? { ...client, customName: name } : client
      );
      set({ clientList: updatedList, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '更新设备名称失败' });
    }
  },

  // 设置设备限速
  setClientSpeedLimit: async (clientId: string, speedLimit: number) => {
    set({ isLoading: true });
    try {
      await setClientSpeedLimitApi(clientId, speedLimit);
      const { clientList } = get();
      const updatedList = clientList.map(client =>
        client.id === clientId ? { ...client, speedLimit } : client
      );
      set({ clientList: updatedList, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '设置限速失败' });
    }
  },

  // 拉黑设备
  blockClient: async (clientId: string) => {
    set({ isLoading: true });
    try {
      await setClientBlockApi(clientId, true);
      const { clientList } = get();
      const updatedList = clientList.map(client =>
        client.id === clientId ? { ...client, isBlocked: true } : client
      );
      set({ clientList: updatedList, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '拉黑设备失败' });
    }
  },

  // 解禁设备
  unblockClient: async (clientId: string) => {
    set({ isLoading: true });
    try {
      await setClientBlockApi(clientId, false);
      const { clientList } = get();
      const updatedList = clientList.map(client =>
        client.id === clientId ? { ...client, isBlocked: false } : client
      );
      set({ clientList: updatedList, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '解禁设备失败' });
    }
  },

  // 设置设备优先级
  setClientPriority: async (clientId: string, priority: 'high' | 'normal' | 'low') => {
    set({ isLoading: true });
    try {
      await setClientPriorityApi(clientId, priority);
      const { clientList } = get();
      const updatedList = clientList.map(client =>
        client.id === clientId ? { ...client, priority } : client
      );
      set({ clientList: updatedList, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '设置优先级失败' });
    }
  },

  // 踢出设备
  kickClient: async (clientId: string) => {
    set({ isLoading: true });
    try {
      await kickClientApi(clientId);
      const { clientList } = get();
      const updatedList = clientList.filter(client => client.id !== clientId);
      set({ clientList: updatedList, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '踢出设备失败' });
    }
  },

  // 设置连接状态
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useDeviceStore;
