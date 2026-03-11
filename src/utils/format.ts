/**
 * 格式化工具函数
 */

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
};

/**
 * 格式化速度
 * @param kbps 速度（KB/s）
 * @returns 格式化后的字符串
 */
export const formatSpeed = (kbps: number): string => {
  if (kbps < 1024) {
    return `${Math.round(kbps)} KB/s`;
  } else {
    return `${(kbps / 1024).toFixed(2)} MB/s`;
  }
};

/**
 * 格式化Mbps速度
 * @param mbps 速度（Mbps）
 * @returns 格式化后的字符串
 */
export const formatMbps = (mbps: number): string => {
  if (mbps < 1) {
    return `${(mbps * 1000).toFixed(0)} Kbps`;
  }
  return `${mbps.toFixed(2)} Mbps`;
};

/**
 * 格式化时长
 * @param seconds 秒数
 * @returns 格式化后的字符串
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return hours > 0 ? `${days}天${hours}小时` : `${days}天`;
  }
};

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式模板
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | Date,
  format: string = 'YYYY-MM-DD'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 格式化MAC地址
 * @param mac MAC地址
 * @returns 标准格式（大写，用冒号分隔）
 */
export const formatMacAddress = (mac: string): string => {
  const cleaned = mac.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  return cleaned.match(/.{1,2}/g)?.join(':') || mac;
};

/**
 * 格式化百分比
 * @param value 0-100之间的数值
 * @param decimals 小数位数
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * 格式化数字（添加千分位）
 * @param num 数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

/**
 * 格式化信号强度
 * @param strength 0-100的数值
 * @returns 信号等级和描述
 */
export const formatSignalStrength = (strength: number): { level: number; label: string } => {
  if (strength >= 80) return { level: 4, label: '强' };
  if (strength >= 60) return { level: 3, label: '良' };
  if (strength >= 40) return { level: 2, label: '中' };
  if (strength >= 20) return { level: 1, label: '弱' };
  return { level: 0, label: '无信号' };
};

/**
 * 截断文本
 * @param text 原文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
