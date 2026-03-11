/**
 * 设备状态和管理API
 */

import apiClient from './client';
import { ApiResponse, DeviceStatus, ClientDevice, WiFiSettings, SystemSettings } from '../types';

// ==================== 设备状态 ====================

/**
 * 获取设备状态
 */
export const getDeviceStatus = async (): Promise<DeviceStatus> => {
  const response = await apiClient.get<ApiResponse<DeviceStatus>>('/api/status');
  return response.data.data;
};

/**
 * 获取电量信息
 */
export const getBatteryInfo = async (): Promise<{ level: number; isCharging: boolean }> => {
  const response = await apiClient.get<ApiResponse<{ level: number; isCharging: boolean }>>('/api/battery');
  return response.data.data;
};

/**
 * 重启设备
 */
export const rebootDevice = async (): Promise<void> => {
  await apiClient.post<ApiResponse<void>>('/api/reboot');
};

// ==================== 连接设备管理 ====================

/**
 * 获取连接设备列表
 */
export const getClientList = async (): Promise<ClientDevice[]> => {
  const response = await apiClient.get<ApiResponse<ClientDevice[]>>('/api/clients');
  return response.data.data;
};

/**
 * 获取设备详情
 */
export const getClientDetail = async (clientId: string): Promise<ClientDevice> => {
  const response = await apiClient.get<ApiResponse<ClientDevice>>(`/api/clients/${clientId}`);
  return response.data.data;
};

/**
 * 更新设备名称
 */
export const updateClientName = async (clientId: string, name: string): Promise<void> => {
  await apiClient.put<ApiResponse<void>>(`/api/clients/${clientId}/name`, { name });
};

/**
 * 设置设备限速
 * @param speedLimit KB/s, 0表示不限速
 */
export const setClientSpeedLimit = async (clientId: string, speedLimit: number): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(`/api/clients/${clientId}/limit`, { speedLimit });
};

/**
 * 拉黑/解禁设备
 */
export const setClientBlock = async (clientId: string, isBlocked: boolean): Promise<void> => {
  if (isBlocked) {
    await apiClient.post<ApiResponse<void>>(`/api/clients/${clientId}/block`);
  } else {
    await apiClient.post<ApiResponse<void>>(`/api/clients/${clientId}/unblock`);
  }
};

/**
 * 设置设备优先级
 */
export const setClientPriority = async (
  clientId: string, 
  priority: 'high' | 'normal' | 'low'
): Promise<void> => {
  await apiClient.put<ApiResponse<void>>(`/api/clients/${clientId}/priority`, { priority });
};

/**
 * 踢出设备
 */
export const kickClient = async (clientId: string): Promise<void> => {
  await apiClient.post<ApiResponse<void>>(`/api/clients/${clientId}/kick`);
};

// ==================== WiFi设置 ====================

/**
 * 获取WiFi设置
 */
export const getWiFiSettings = async (): Promise<WiFiSettings> => {
  const response = await apiClient.get<ApiResponse<WiFiSettings>>('/api/settings/wifi');
  return response.data.data;
};

/**
 * 更新WiFi设置
 */
export const updateWiFiSettings = async (settings: Partial<WiFiSettings>): Promise<void> => {
  await apiClient.put<ApiResponse<void>>('/api/settings/wifi', settings);
};

// ==================== 系统设置 ====================

/**
 * 获取系统设置
 */
export const getSystemSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.get<ApiResponse<SystemSettings>>('/api/settings/system');
  return response.data.data;
};

/**
 * 更新系统设置
 */
export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<void> => {
  await apiClient.put<ApiResponse<void>>('/api/settings/system', settings);
};

/**
 * 检查固件更新
 */
export const checkFirmwareUpdate = async (): Promise<{
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion?: string;
  releaseNotes?: string;
  downloadUrl?: string;
}> => {
  const response = await apiClient.get<ApiResponse<{
    hasUpdate: boolean;
    currentVersion: string;
    latestVersion?: string;
    releaseNotes?: string;
    downloadUrl?: string;
  }>>('/api/firmware/check');
  return response.data.data;
};

/**
 * 执行固件升级
 */
export const upgradeFirmware = async (): Promise<void> => {
  await apiClient.post<ApiResponse<void>>('/api/firmware/upgrade');
};
