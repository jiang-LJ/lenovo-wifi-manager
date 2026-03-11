/**
 * 格式化工具函数测试
 */

import {
  formatFileSize,
  formatSpeed,
  formatMbps,
  formatDuration,
  formatDate,
  formatMacAddress,
  formatPercent,
  formatNumber,
  formatSignalStrength,
  truncateText,
} from '../../utils/format';

describe('format', () => {
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });
  });

  describe('formatSpeed', () => {
    it('should format KB/s correctly', () => {
      expect(formatSpeed(100)).toBe('100 KB/s');
      expect(formatSpeed(999)).toBe('999 KB/s');
    });

    it('should format MB/s correctly', () => {
      expect(formatSpeed(1024)).toBe('1.00 MB/s');
      expect(formatSpeed(2048)).toBe('2.00 MB/s');
    });
  });

  describe('formatMbps', () => {
    it('should format Kbps for small values', () => {
      expect(formatMbps(0.5)).toBe('500 Kbps');
      expect(formatMbps(0.1)).toBe('100 Kbps');
    });

    it('should format Mbps for larger values', () => {
      expect(formatMbps(1)).toBe('1.00 Mbps');
      expect(formatMbps(100)).toBe('100.00 Mbps');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(30)).toBe('30秒');
      expect(formatDuration(59)).toBe('59秒');
    });

    it('should format minutes correctly', () => {
      expect(formatDuration(60)).toBe('1分');
      expect(formatDuration(90)).toBe('1分30秒');
      expect(formatDuration(300)).toBe('5分');
    });

    it('should format hours correctly', () => {
      expect(formatDuration(3600)).toBe('1小时');
      expect(formatDuration(3660)).toBe('1小时1分');
    });

    it('should format days correctly', () => {
      expect(formatDuration(86400)).toBe('1天');
      expect(formatDuration(90000)).toBe('1天1小时');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-03-11T10:30:00';
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-11');
      expect(formatDate(date, 'HH:mm')).toBe('10:30');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-03-11T10:30:00');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-03-11');
    });
  });

  describe('formatMacAddress', () => {
    it('should format MAC address correctly', () => {
      expect(formatMacAddress('aabbccddeeff')).toBe('AA:BB:CC:DD:EE:FF');
      expect(formatMacAddress('AA:BB:CC:DD:EE:FF')).toBe('AA:BB:CC:DD:EE:FF');
      expect(formatMacAddress('AA-BB-CC-DD-EE-FF')).toBe('AA:BB:CC:DD:EE:FF');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage correctly', () => {
      expect(formatPercent(50)).toBe('50.0%');
      expect(formatPercent(50.5, 2)).toBe('50.50%');
    });
  });

  describe('formatNumber', () => {
    it('should format number with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('formatSignalStrength', () => {
    it('should return correct level and label', () => {
      expect(formatSignalStrength(90)).toEqual({ level: 4, label: '强' });
      expect(formatSignalStrength(70)).toEqual({ level: 3, label: '良' });
      expect(formatSignalStrength(50)).toEqual({ level: 2, label: '中' });
      expect(formatSignalStrength(30)).toEqual({ level: 1, label: '弱' });
      expect(formatSignalStrength(10)).toEqual({ level: 0, label: '无信号' });
    });
  });

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Hi', 10)).toBe('Hi');
    });
  });
});
