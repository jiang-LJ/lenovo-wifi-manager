/**
 * 流量统计API
 */

import apiClient from './client';
import { 
  ApiResponse, 
  TrafficRecord, 
  ClientTraffic 
} from '../types';

/**
 * 获取日流量数据
 */
export const getDailyTraffic = async (date?: string): Promise<TrafficRecord> => {
  const params = date ? { date } : {};
  const response = await apiClient.get<ApiResponse<TrafficRecord>>('/api/traffic/daily', { params });
  return response.data.data;
};

/**
 * 获取周流量数据
 */
export const getWeeklyTraffic = async (): Promise<{
  days: Array<{
    date: string;
    upload: number;
    download: number;
  }>;
  totalUpload: number;
  totalDownload: number;
}> => {
  const response = await apiClient.get<ApiResponse<{
    days: Array<{
      date: string;
      upload: number;
      download: number;
    }>;
    totalUpload: number;
    totalDownload: number;
  }>>('/api/traffic/weekly');
  return response.data.data;
};

/**
 * 获取月流量数据
 */
export const getMonthlyTraffic = async (
  year?: number, 
  month?: number
): Promise<{
  year: number;
  month: number;
  days: Array<{
    date: string;
    upload: number;
    download: number;
  }>;
  totalUpload: number;
  totalDownload: number;
}> => {
  const params: { year?: number; month?: number } = {};
  if (year !== undefined) params.year = year;
  if (month !== undefined) params.month = month;
  
  const response = await apiClient.get<ApiResponse<{
    year: number;
    month: number;
    days: Array<{
      date: string;
      upload: number;
      download: number;
    }>;
    totalUpload: number;
    totalDownload: number;
  }>>('/api/traffic/monthly', { params });
  return response.data.data;
};

/**
 * 获取各设备流量统计
 */
export const getClientTraffic = async (
  period: 'day' | 'week' | 'month' = 'day'
): Promise<ClientTraffic[]> => {
  const response = await apiClient.get<ApiResponse<ClientTraffic[]>>('/api/traffic/clients', {
    params: { period }
  });
  return response.data.data;
};

/**
 * 获取实时流量
 */
export const getRealtimeTraffic = async (): Promise<{
  uploadSpeed: number; // KB/s
  downloadSpeed: number; // KB/s
  totalUpload: number; // MB
  totalDownload: number; // MB;
}> => {
  const response = await apiClient.get<ApiResponse<{
    uploadSpeed: number;
    downloadSpeed: number;
    totalUpload: number;
    totalDownload: number;
  }>>('/api/traffic/realtime');
  return response.data.data;
};

/**
 * 获取流量预警设置
 */
export const getTrafficAlertSettings = async (): Promise<{
  dailyLimit: number; // MB, 0表示不限
  monthlyLimit: number; // MB, 0表示不限
  notifyWhenReach: number; // 百分比
}> => {
  const response = await apiClient.get<ApiResponse<{
    dailyLimit: number;
    monthlyLimit: number;
    notifyWhenReach: number;
  }>>('/api/traffic/alert-settings');
  return response.data.data;
};

/**
 * 更新流量预警设置
 */
export const updateTrafficAlertSettings = async (settings: {
  dailyLimit?: number;
  monthlyLimit?: number;
  notifyWhenReach?: number;
}): Promise<void> => {
  await apiClient.put<ApiResponse<void>>('/api/traffic/alert-settings', settings);
};
