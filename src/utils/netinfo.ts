/**
 * 网络信息工具
 * 模拟实现，实际项目中应使用@react-native-community/netinfo
 */

export interface NetworkState {
  isConnected: boolean;
  isWifiEnabled: boolean;
  ssid: string | null;
  ipAddress: string | null;
}

type NetworkChangeCallback = (state: NetworkState) => void;

class NetInfoManager {
  private listeners: NetworkChangeCallback[] = [];
  private currentState: NetworkState = {
    isConnected: true,
    isWifiEnabled: true,
    ssid: null,
    ipAddress: null,
  };

  async fetch(): Promise<NetworkState> {
    // 实际项目中应该获取真实网络状态
    return this.currentState;
  }

  addEventListener(callback: NetworkChangeCallback): () => void {
    this.listeners.push(callback);
    
    // 立即回调当前状态
    callback(this.currentState);

    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 模拟网络状态变化（仅用于测试）
  simulateNetworkChange(state: Partial<NetworkState>) {
    this.currentState = { ...this.currentState, ...state };
    this.listeners.forEach(callback => callback(this.currentState));
  }
}

export const NetInfo = new NetInfoManager();
export default NetInfo;
