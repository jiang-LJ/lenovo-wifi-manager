/**
 * 流量统计状态管理
 */

import { create } from 'zustand';
import { TrafficRecord, ClientTraffic } from '../types';
import { database } from '../utils/database';
import {
  getDailyTraffic as getDailyTrafficApi,
  getWeeklyTraffic as getWeeklyTrafficApi,
  getMonthlyTraffic as getMonthlyTrafficApi,
  getClientTraffic as getClientTrafficApi,
  getRealtimeTraffic as getRealtimeTrafficApi,
} from '../api/traffic';

interface TrafficState {
  // 状态
  dailyTraffic: TrafficRecord | null;
  weeklyTraffic: Array<{ date: string; upload: number; download: number }> | null;
  monthlyTraffic: {
    year: number;
    month: number;
    days: Array<{ date: string; upload: number; download: number }>;
    totalUpload: number;
    totalDownload: number;
  } | null;
  clientTraffic: ClientTraffic[];
  realtimeTraffic: {
    uploadSpeed: number;
    downloadSpeed: number;
    totalUpload: number;
    totalDownload: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  trafficLimit: {
    daily: number;
    monthly: number;
    notifyPercent: number;
  };

  // 动作
  fetchDailyTraffic: (date?: string) => Promise<void>;
  fetchWeeklyTraffic: () => Promise<void>;
  fetchMonthlyTraffic: (year?: number, month?: number) => Promise<void>;
  fetchClientTraffic: (period?: 'day' | 'week' | 'month') => Promise<void>;
  fetchRealtimeTraffic: () => Promise<void>;
  setTrafficLimit: (limit: { daily?: number; monthly?: number; notifyPercent?: number }) => void;
  clearError: () => void;
}

export const useTrafficStore = create<TrafficState>((set, get) => ({
  // 初始状态
  dailyTraffic: null,
  weeklyTraffic: null,
  monthlyTraffic: null,
  clientTraffic: [],
  realtimeTraffic: null,
  isLoading: false,
  error: null,
  trafficLimit: {
    daily: 0, // 0表示不限
    monthly: 0,
    notifyPercent: 80,
  },

  // 获取日流量
  fetchDailyTraffic: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      // 先尝试从API获取
      const data = await getDailyTrafficApi(date);
      set({ dailyTraffic: data, isLoading: false });
      
      // 缓存到数据库
      if (data) {
        await database.saveTrafficLog(
          data.date,
          new Date().getHours(),
          data.totalUpload,
          data.totalDownload
        );
      }
    } catch (error: any) {
      // API失败，尝试从数据库获取
      try {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const cached = await database.getTrafficByDate(targetDate);
        if (cached) {
          set({ dailyTraffic: cached, isLoading: false });
        } else {
          set({ isLoading: false, error: error?.message || '获取日流量失败' });
        }
      } catch {
        set({ isLoading: false, error: error?.message || '获取日流量失败' });
      }
    }
  },

  // 获取周流量
  fetchWeeklyTraffic: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getWeeklyTrafficApi();
      set({ weeklyTraffic: data.days, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '获取周流量失败' });
    }
  },

  // 获取月流量
  fetchMonthlyTraffic: async (year?: number, month?: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMonthlyTrafficApi(year, month);
      set({ monthlyTraffic: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '获取月流量失败' });
    }
  },

  // 获取客户端流量排行
  fetchClientTraffic: async (period: 'day' | 'week' | 'month' = 'day') => {
    set({ isLoading: true, error: null });
    try {
      const data = await getClientTrafficApi(period);
      set({ clientTraffic: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || '获取设备流量失败' });
    }
  },

  // 获取实时流量
  fetchRealtimeTraffic: async () => {
    try {
      const data = await getRealtimeTrafficApi();
      set({ realtimeTraffic: data });
    } catch (error: any) {
      console.error('获取实时流量失败:', error);
    }
  },

  // 设置流量限额
  setTrafficLimit: (limit) => {
    const current = get().trafficLimit;
    set({
      trafficLimit: {
        ...current,
        ...limit,
      },
    });
  },

  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useTrafficStore;
