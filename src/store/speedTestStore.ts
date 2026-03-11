/**
 * 网络测速状态管理
 */

import { create } from 'zustand';
import { SpeedTestRecord } from '../types';
import { database } from '../utils/database';
import {
  runSpeedTest as runSpeedTestApi,
  getSpeedTestHistory as getSpeedTestHistoryApi,
  clearSpeedTestHistory as clearSpeedTestHistoryApi,
  getSpeedTestServers as getSpeedTestServersApi,
} from '../api/speedtest';

interface SpeedTestState {
  // 状态
  currentTest: SpeedTestRecord | null;
  testHistory: SpeedTestRecord[];
  servers: Array<{
    id: string;
    name: string;
    location: string;
    distance: string;
    host: string;
  }>;
  isTesting: boolean;
  isLoading: boolean;
  testProgress: number;
  error: string | null;

  // 动作
  runSpeedTest: (serverId?: string) => Promise<void>;
  fetchTestHistory: (limit?: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  fetchServers: () => Promise<void>;
  clearError: () => void;
}

export const useSpeedTestStore = create<SpeedTestState>((set, get) => ({
  // 初始状态
  currentTest: null,
  testHistory: [],
  servers: [],
  isTesting: false,
  isLoading: false,
  testProgress: 0,
  error: null,

  // 执行测速
  runSpeedTest: async (serverId?: string) => {
    set({ isTesting: true, testProgress: 0, error: null, currentTest: null });
    
    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        set(state => ({
          testProgress: Math.min(state.testProgress + 5, 90),
        }));
      }, 1000);

      const result = serverId 
        ? await runSpeedTestApi() // 实际应该调用带serverId的方法
        : await runSpeedTestApi();

      clearInterval(progressInterval);

      // 保存到数据库
      await database.saveSpeedTest(result);

      set({
        currentTest: result,
        isTesting: false,
        testProgress: 100,
      });

      // 刷新历史记录
      await get().fetchTestHistory();
    } catch (error: any) {
      set({
        isTesting: false,
        testProgress: 0,
        error: error?.message || '测速失败，请重试',
      });
    }
  },

  // 获取测速历史
  fetchTestHistory: async (limit: number = 50) => {
    set({ isLoading: true, error: null });
    try {
      // 先尝试从API获取
      const data = await getSpeedTestHistoryApi(limit);
      set({ testHistory: data, isLoading: false });
    } catch (error: any) {
      // API失败，从数据库获取
      try {
        const cached = await database.getSpeedTestHistory(limit);
        set({ testHistory: cached, isLoading: false });
      } catch {
        set({ isLoading: false, error: error?.message || '获取测速历史失败' });
      }
    }
  },

  // 清除历史
  clearHistory: async () => {
    set({ isLoading: true });
    try {
      await clearSpeedTestHistoryApi();
      await database.clearSpeedTestHistory();
      set({ testHistory: [], isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '清除历史失败' });
    }
  },

  // 获取测速服务器列表
  fetchServers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getSpeedTestServersApi();
      set({ servers: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '获取服务器列表失败' });
    }
  },

  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useSpeedTestStore;
