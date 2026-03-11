/**
 * 网络测速API
 */

import apiClient from './client';
import { ApiResponse, SpeedTestRecord } from '../types';

/**
 * 执行网络测速
 * 注意：这是一个耗时操作，可能需要10-30秒
 */
export const runSpeedTest = async (): Promise<SpeedTestRecord> => {
  const response = await apiClient.post<ApiResponse<SpeedTestRecord>>('/api/speedtest/run', {}, {
    timeout: 60000, // 60秒超时
  });
  return response.data.data;
};

/**
 * 获取测速历史记录
 */
export const getSpeedTestHistory = async (
  limit: number = 50
): Promise<SpeedTestRecord[]> => {
  const response = await apiClient.get<ApiResponse<SpeedTestRecord[]>>('/api/speedtest/history', {
    params: { limit }
  });
  return response.data.data;
};

/**
 * 清除测速历史
 */
export const clearSpeedTestHistory = async (): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>('/api/speedtest/history');
};

/**
 * 获取推荐测速服务器列表
 */
export const getSpeedTestServers = async (): Promise<Array<{
  id: string;
  name: string;
  location: string;
  distance: string;
  host: string;
}>> => {
  const response = await apiClient.get<ApiResponse<Array<{
    id: string;
    name: string;
    location: string;
    distance: string;
    host: string;
  }>>>('/api/speedtest/servers');
  return response.data.data;
};

/**
 * 使用指定服务器进行测速
 */
export const runSpeedTestWithServer = async (serverId: string): Promise<SpeedTestRecord> => {
  const response = await apiClient.post<ApiResponse<SpeedTestRecord>>('/api/speedtest/run', {
    serverId
  }, {
    timeout: 60000,
  });
  return response.data.data;
};
