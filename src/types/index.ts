/**
 * 类型定义文件
 * 包含应用所有接口定义
 */

// ==================== 用户配置 ====================
export interface AppConfig {
  deviceIp: string;
  username: string;
  passwordEncrypted: string;
  rememberPassword: boolean;
  autoLogin: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en';
}

// ==================== 设备状态 ====================
export interface DeviceStatus {
  isOnline: boolean;
  signalStrength: number; // 0-100
  uptime: number; // 运行时长（秒）
  batteryLevel?: number; // 电量 0-100
  networkMode: '4G' | '5G' | 'WiFi' | 'Ethernet';
  connectedClients: number;
  totalUpload: number; // MB
  totalDownload: number; // MB
  ssid: string;
  firmwareVersion: string;
}

// ==================== 连接设备 ====================
export interface ClientDevice {
  id: string;
  macAddress: string;
  ipAddress: string;
  name: string;
  customName?: string;
  deviceType: 'phone' | 'computer' | 'iot' | 'unknown';
  isOnline: boolean;
  connectedTime: number; // 连接时长（秒）
  uploadSpeed: number; // KB/s
  downloadSpeed: number; // KB/s
  totalUpload: number; // MB
  totalDownload: number; // MB;
  isBlocked: boolean;
  speedLimit: number; // KB/s, 0表示不限速
  priority: 'high' | 'normal' | 'low';
  firstSeen: string;
  lastSeen: string;
}

// ==================== 流量记录 ====================
export interface TrafficRecord {
  date: string; // YYYY-MM-DD
  hourlyData: HourlyTraffic[];
  totalUpload: number; // MB
  totalDownload: number; // MB
}

export interface HourlyTraffic {
  hour: number; // 0-23
  upload: number; // MB
  download: number; // MB
}

export interface ClientTraffic {
  macAddress: string;
  name: string;
  totalUpload: number;
  totalDownload: number;
  percentage: number;
}

// ==================== 测速记录 ====================
export interface SpeedTestRecord {
  id?: number;
  timestamp: string;
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  pingMs: number;
  jitterMs: number;
  packetLoss: number; // 百分比
  serverName?: string;
  serverLocation?: string;
}

// ==================== WiFi设置 ====================
export interface WiFiSettings {
  ssid: string;
  password: string;
  isHidden: boolean;
  channel: number;
  band: '2.4G' | '5G' | 'dual';
  bandwidth: '20MHz' | '40MHz' | '80MHz';
  txPower: 'low' | 'medium' | 'high';
  security: {
    mode: 'WPA3' | 'WPA2' | 'WPA' | 'WEP' | 'none';
    encryption: 'AES' | 'TKIP' | 'TKIP+AES';
  };
  guestNetwork: {
    enabled: boolean;
    ssid: string;
    password: string;
    maxClients: number;
    bandwidthLimit: number; // Mbps
  };
  macFilter: {
    enabled: boolean;
    mode: 'whitelist' | 'blacklist';
    macList: string[];
  };
}

// ==================== 系统设置 ====================
export interface SystemSettings {
  deviceName: string;
  adminPassword: string;
  timezone: string;
  autoReboot: {
    enabled: boolean;
    schedule: string; // cron格式或特定格式
  };
  firmwareUpdate: {
    autoCheck: boolean;
    autoInstall: boolean;
    currentVersion: string;
    latestVersion?: string;
    releaseNotes?: string;
  };
}

// ==================== API响应 ====================
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  userInfo: {
    username: string;
    role: string;
  };
}

// ==================== 通知 ====================
export interface AppNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    label: string;
    route: string;
  };
}

// ==================== 应用状态 ====================
export interface AppState {
  isLoading: boolean;
  isAuthenticated: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  lastSyncTime?: string;
  notifications: AppNotification[];
  error?: string;
}

// ==================== 主题 ====================
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;
}

// ==================== 导航 ====================
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Devices: undefined;
  Traffic: undefined;
  SpeedTest: undefined;
  Settings: undefined;
};
