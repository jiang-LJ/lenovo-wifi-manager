/**
 * 自动同步Hook
 * 定时同步设备状态和流量数据
 */

import { useEffect, useRef, useCallback } from 'react';
import { useDeviceStore } from '../store/deviceStore';
import { useTrafficStore } from '../store/trafficStore';
import { useAuthStore } from '../store/authStore';

interface UseAutoSyncOptions {
  enabled?: boolean;
  interval?: number; // 同步间隔（毫秒）
}

export const useAutoSync = (options: UseAutoSyncOptions = {}) => {
  const { enabled = true, interval = 30000 } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { isAuthenticated } = useAuthStore();
  const { syncAllData, fetchDeviceStatus } = useDeviceStore();
  const { fetchRealtimeTraffic } = useTrafficStore();

  const sync = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // 快速同步设备状态
      await fetchDeviceStatus();
      // 获取实时流量
      await fetchRealtimeTraffic();
    } catch (error) {
      console.error('自动同步失败:', error);
    }
  }, [isAuthenticated, fetchDeviceStatus, fetchRealtimeTraffic]);

  const fullSync = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await syncAllData();
    } catch (error) {
      console.error('完全同步失败:', error);
    }
  }, [isAuthenticated, syncAllData]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // 立即执行一次同步
    sync();

    // 设置定时器
    timerRef.current = setInterval(() => {
      sync();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, isAuthenticated, interval, sync]);

  return { sync, fullSync };
};

export default useAutoSync;
