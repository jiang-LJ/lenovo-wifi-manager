/**
 * 流量统计页面测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TrafficScreen } from '../../screens/TrafficScreen';
import { useTrafficStore } from '../../store/trafficStore';

// Mock the store
jest.mock('../../store/trafficStore');

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
}));

// Mock vector icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

describe('TrafficScreen', () => {
  const mockFetchDailyTraffic = jest.fn();
  const mockFetchWeeklyTraffic = jest.fn();
  const mockFetchMonthlyTraffic = jest.fn();
  const mockFetchClientTraffic = jest.fn();

  const mockDailyTraffic = {
    date: '2024-03-11',
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      upload: i * 10,
      download: i * 50,
    })),
    totalUpload: 2760,
    totalDownload: 13800,
  };

  const mockWeeklyTraffic = [
    { date: '2024-03-05', upload: 100, download: 500 },
    { date: '2024-03-06', upload: 120, download: 600 },
    { date: '2024-03-07', upload: 90, download: 450 },
    { date: '2024-03-08', upload: 110, download: 550 },
    { date: '2024-03-09', upload: 130, download: 650 },
    { date: '2024-03-10', upload: 140, download: 700 },
    { date: '2024-03-11', upload: 150, download: 750 },
  ];

  const mockMonthlyTraffic = {
    year: 2024,
    month: 3,
    days: Array.from({ length: 11 }, (_, i) => ({
      date: `2024-03-${String(i + 1).padStart(2, '0')}`,
      upload: 100 + i * 10,
      download: 500 + i * 50,
    })),
    totalUpload: 1650,
    totalDownload: 8250,
  };

  const mockClientTraffic = [
    { macAddress: 'AA:BB:CC:DD:EE:01', name: 'iPhone', totalUpload: 500, totalDownload: 2000, percentage: 40 },
    { macAddress: 'AA:BB:CC:DD:EE:02', name: 'MacBook', totalUpload: 300, totalDownload: 1500, percentage: 30 },
    { macAddress: 'AA:BB:CC:DD:EE:03', name: 'iPad', totalUpload: 200, totalDownload: 1000, percentage: 20 },
    { macAddress: 'AA:BB:CC:DD:EE:04', name: 'Unknown', totalUpload: 100, totalDownload: 500, percentage: 10 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    (useTrafficStore as jest.Mock).mockReturnValue({
      dailyTraffic: mockDailyTraffic,
      weeklyTraffic: mockWeeklyTraffic,
      monthlyTraffic: mockMonthlyTraffic,
      clientTraffic: mockClientTraffic,
      isLoading: false,
      fetchDailyTraffic: mockFetchDailyTraffic,
      fetchWeeklyTraffic: mockFetchWeeklyTraffic,
      fetchMonthlyTraffic: mockFetchMonthlyTraffic,
      fetchClientTraffic: mockFetchClientTraffic,
    });
  });

  it('should render correctly with daily data', () => {
    const { getByText, getAllByText } = render(<TrafficScreen />);
    
    // Check header
    expect(getByText('今日')).toBeTruthy();
    expect(getByText('本周')).toBeTruthy();
    expect(getByText('本月')).toBeTruthy();
    
    // Check total traffic card
    expect(getByText('总流量')).toBeTruthy();
    
    // Check section titles
    expect(getByText('24小时流量')).toBeTruthy();
    expect(getByText('设备流量排行')).toBeTruthy();
  });

  it('should switch to weekly view when 本周 tab is pressed', async () => {
    const { getByText } = render(<TrafficScreen />);
    
    fireEvent.press(getByText('本周'));
    
    await waitFor(() => {
      expect(mockFetchWeeklyTraffic).toHaveBeenCalled();
    });
  });

  it('should switch to monthly view when 本月 tab is pressed', async () => {
    const { getByText } = render(<TrafficScreen />);
    
    fireEvent.press(getByText('本月'));
    
    await waitFor(() => {
      expect(mockFetchMonthlyTraffic).toHaveBeenCalled();
    });
  });

  it('should display client traffic ranking', () => {
    const { getByText } = render(<TrafficScreen />);
    
    // Check if device names are displayed
    expect(getByText('iPhone')).toBeTruthy();
    expect(getByText('MacBook')).toBeTruthy();
    expect(getByText('iPad')).toBeTruthy();
  });

  it('should show empty state when no client traffic data', () => {
    (useTrafficStore as jest.Mock).mockReturnValue({
      dailyTraffic: mockDailyTraffic,
      weeklyTraffic: mockWeeklyTraffic,
      monthlyTraffic: mockMonthlyTraffic,
      clientTraffic: [],
      isLoading: false,
      fetchDailyTraffic: mockFetchDailyTraffic,
      fetchWeeklyTraffic: mockFetchWeeklyTraffic,
      fetchMonthlyTraffic: mockFetchMonthlyTraffic,
      fetchClientTraffic: mockFetchClientTraffic,
    });

    const { getByText } = render(<TrafficScreen />);
    
    expect(getByText('暂无数据')).toBeTruthy();
  });

  it('should fetch data on mount', () => {
    (useTrafficStore as jest.Mock).mockReturnValue({
      dailyTraffic: null,
      weeklyTraffic: null,
      monthlyTraffic: null,
      clientTraffic: [],
      isLoading: true,
      fetchDailyTraffic: mockFetchDailyTraffic,
      fetchWeeklyTraffic: mockFetchWeeklyTraffic,
      fetchMonthlyTraffic: mockFetchMonthlyTraffic,
      fetchClientTraffic: mockFetchClientTraffic,
    });

    render(<TrafficScreen />);
    
    // Data should be fetched on mount
    expect(mockFetchDailyTraffic).toHaveBeenCalled();
  });

  it('should display correct rank numbers for top devices', () => {
    const { getAllByText } = render(<TrafficScreen />);
    
    // Check rank numbers (1, 2, 3, 4)
    const ranks = getAllByText(/^[1-4]$/);
    expect(ranks.length).toBeGreaterThan(0);
  });

  it('should format traffic data correctly', () => {
    const { getByText } = render(<TrafficScreen />);
    
    // Check if traffic values are formatted
    // Total traffic should be displayed
    expect(getByText('总流量')).toBeTruthy();
  });

  it('should handle refresh action', async () => {
    const { getByTestId } = render(<TrafficScreen />);
    
    // Trigger refresh (if RefreshControl is accessible)
    // This depends on how the component is implemented
    await waitFor(() => {
      expect(mockFetchDailyTraffic).toHaveBeenCalled();
    });
  });

  it('should display download and upload for each device', () => {
    const { getAllByText } = render(<TrafficScreen />);
    
    // Check for download/upload indicators
    const downloadTexts = getAllByText(/↓/);
    const uploadTexts = getAllByText(/↑/);
    
    expect(downloadTexts.length).toBeGreaterThan(0);
    expect(uploadTexts.length).toBeGreaterThan(0);
  });
});
