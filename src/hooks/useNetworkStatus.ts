/**
 * 网络状态监测Hook
 */

import { useState, useEffect } from 'react';
import { NetInfo, NetworkState } from '../utils/netinfo';

export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isWifiEnabled: false,
    ssid: null,
    ipAddress: null,
  });

  useEffect(() => {
    // 初始获取网络状态
    NetInfo.fetch().then(setNetworkState);

    // 订阅网络状态变化
    const unsubscribe = NetInfo.addEventListener(setNetworkState);

    return () => {
      unsubscribe();
    };
  }, []);

  return networkState;
};

// 模拟NetInfo实现（实际项目中应使用@react-native-community/netinfo）
export const mockNetInfo = {
  fetch: async () => ({
    isConnected: true,
    isWifiEnabled: true,
    ssid: 'Lenovo_WiFi_5G',
    ipAddress: '192.168.0.100',
  }),
  addEventListener: (_callback: (state: NetworkState) => void) => {
    // 模拟网络变化
    return () => {};
  },
};

export default useNetworkStatus;
