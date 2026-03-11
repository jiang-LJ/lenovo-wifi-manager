/**
 * 设备状态管理测试
 */

import { useDeviceStore } from '../../store/deviceStore';
import {
  getDeviceStatus as getDeviceStatusApi,
  getClientList as getClientListApi,
  getBatteryInfo as getBatteryInfoApi,
  updateClientName as updateClientNameApi,
  setClientSpeedLimit as setClientSpeedLimitApi,
  setClientBlock as setClientBlockApi,
  setClientPriority as setClientPriorityApi,
  kickClient as kickClientApi,
} from '../../api/device';
import { ClientDevice, DeviceStatus } from '../../types';

// Mock API
jest.mock('../../api/device');

describe('Device Store', () => {
  const mockDeviceStatus: DeviceStatus = {
    isOnline: true,
    signalStrength: 85,
    uptime: 86400,
    batteryLevel: 75,
    networkMode: '5G',
    connectedClients: 5,
    totalUpload: 1024,
    totalDownload: 5120,
    ssid: 'Lenovo_WiFi_5G',
    firmwareVersion: '1.2.3',
  };

  const mockClientList: ClientDevice[] = [
    {
      id: '1',
      macAddress: 'AA:BB:CC:DD:EE:01',
      ipAddress: '192.168.0.101',
      name: 'iPhone',
      customName: '我的iPhone',
      deviceType: 'phone',
      isOnline: true,
      connectedTime: 3600,
      uploadSpeed: 100,
      downloadSpeed: 500,
      totalUpload: 50,
      totalDownload: 200,
      isBlocked: false,
      speedLimit: 0,
      priority: 'normal',
      firstSeen: '2024-03-01',
      lastSeen: '2024-03-11',
    },
    {
      id: '2',
      macAddress: 'AA:BB:CC:DD:EE:02',
      ipAddress: '192.168.0.102',
      name: 'MacBook',
      deviceType: 'computer',
      isOnline: false,
      connectedTime: 0,
      uploadSpeed: 0,
      downloadSpeed: 0,
      totalUpload: 100,
      totalDownload: 500,
      isBlocked: false,
      speedLimit: 1024,
      priority: 'high',
      firstSeen: '2024-03-05',
      lastSeen: '2024-03-10',
    },
  ];

  beforeEach(() => {
    useDeviceStore.setState({
      deviceStatus: null,
      clientList: [],
      batteryInfo: null,
      isLoading: false,
      error: null,
      lastSyncTime: null,
      connectionStatus: 'disconnected',
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useDeviceStore.getState();
      
      expect(state.deviceStatus).toBeNull();
      expect(state.clientList).toEqual([]);
      expect(state.batteryInfo).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.connectionStatus).toBe('disconnected');
    });
  });

  describe('fetchDeviceStatus', () => {
    it('should fetch and set device status', async () => {
      (getDeviceStatusApi as jest.Mock).mockResolvedValueOnce(mockDeviceStatus);

      await useDeviceStore.getState().fetchDeviceStatus();

      const state = useDeviceStore.getState();
      expect(state.deviceStatus).toEqual(mockDeviceStatus);
      expect(state.connectionStatus).toBe('connected');
      expect(state.lastSyncTime).not.toBeNull();
    });

    it('should handle fetch error', async () => {
      const error = new Error('Network error');
      (getDeviceStatusApi as jest.Mock).mockRejectedValueOnce(error);

      await useDeviceStore.getState().fetchDeviceStatus();

      const state = useDeviceStore.getState();
      expect(state.connectionStatus).toBe('disconnected');
      expect(state.error).toBe('Network error');
    });
  });

  describe('fetchClientList', () => {
    it('should fetch and set client list', async () => {
      (getClientListApi as jest.Mock).mockResolvedValueOnce(mockClientList);

      await useDeviceStore.getState().fetchClientList();

      expect(useDeviceStore.getState().clientList).toEqual(mockClientList);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch');
      (getClientListApi as jest.Mock).mockRejectedValueOnce(error);

      await useDeviceStore.getState().fetchClientList();

      expect(useDeviceStore.getState().error).toBe('Failed to fetch');
    });
  });

  describe('fetchBatteryInfo', () => {
    it('should fetch and set battery info', async () => {
      const batteryInfo = { level: 80, isCharging: true };
      (getBatteryInfoApi as jest.Mock).mockResolvedValueOnce(batteryInfo);

      await useDeviceStore.getState().fetchBatteryInfo();

      expect(useDeviceStore.getState().batteryInfo).toEqual(batteryInfo);
    });

    it('should silently fail when battery API not supported', async () => {
      (getBatteryInfoApi as jest.Mock).mockRejectedValueOnce(new Error('Not supported'));

      // Should not throw
      await expect(useDeviceStore.getState().fetchBatteryInfo()).resolves.not.toThrow();
      
      expect(useDeviceStore.getState().batteryInfo).toBeNull();
    });
  });

  describe('syncAllData', () => {
    it('should sync all data successfully', async () => {
      (getDeviceStatusApi as jest.Mock).mockResolvedValueOnce(mockDeviceStatus);
      (getClientListApi as jest.Mock).mockResolvedValueOnce(mockClientList);
      (getBatteryInfoApi as jest.Mock).mockResolvedValueOnce({ level: 80, isCharging: false });

      await useDeviceStore.getState().syncAllData();

      const state = useDeviceStore.getState();
      expect(state.deviceStatus).toEqual(mockDeviceStatus);
      expect(state.clientList).toEqual(mockClientList);
      expect(state.isLoading).toBe(false);
    });

    it('should handle sync error', async () => {
      (getDeviceStatusApi as jest.Mock).mockRejectedValueOnce(new Error('Sync failed'));

      await useDeviceStore.getState().syncAllData();

      expect(useDeviceStore.getState().error).toBe('Sync failed');
      expect(useDeviceStore.getState().isLoading).toBe(false);
    });
  });

  describe('updateClientName', () => {
    it('should update client name', async () => {
      useDeviceStore.setState({ clientList: mockClientList });
      (updateClientNameApi as jest.Mock).mockResolvedValueOnce(undefined);

      await useDeviceStore.getState().updateClientName('1', 'New Name');

      const client = useDeviceStore.getState().clientList.find(c => c.id === '1');
      expect(client?.customName).toBe('New Name');
    });

    it('should handle update error', async () => {
      useDeviceStore.setState({ clientList: mockClientList });
      (updateClientNameApi as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

      await useDeviceStore.getState().updateClientName('1', 'New Name');

      expect(useDeviceStore.getState().error).toBe('Update failed');
    });
  });

  describe('setClientSpeedLimit', () => {
    it('should set speed limit for client', async () => {
      useDeviceStore.setState({ clientList: mockClientList });
      (setClientSpeedLimitApi as jest.Mock).mockResolvedValueOnce(undefined);

      await useDeviceStore.getState().setClientSpeedLimit('1', 2048);

      const client = useDeviceStore.getState().clientList.find(c => c.id === '1');
      expect(client?.speedLimit).toBe(2048);
    });
  });

  describe('blockClient', () => {
    it('should block client', async () => {
      useDeviceStore.setState({ clientList: mockClientList });
      (setClientBlockApi as jest.Mock).mockResolvedValueOnce(undefined);

      await useDeviceStore.getState().blockClient('1');

      const client = useDeviceStore.getState().clientList.find(c => c.id === '1');
      expect(client?.isBlocked).toBe(true);
    });
  });

  describe('unblockClient', () => {
    it('should unblock client', async () => {
      const blockedClient = { ...mockClientList[0], isBlocked: true };
      useDeviceStore.setState({ clientList: [blockedClient] });
      (setClientBlockApi as jest.Mock).mockResolvedValueOnce(undefined);

      await useDeviceStore.getState().unblockClient('1');

      const client = useDeviceStore.getState().clientList.find(c => c.id === '1');
      expect(client?.isBlocked).toBe(false);
    });
  });

  describe('setClientPriority', () => {
    it('should set client priority', async () => {
      useDeviceStore.setState({ clientList: mockClientList });
      (setClientPriorityApi as jest.Mock).mockResolvedValueOnce(undefined);

      await useDeviceStore.getState().setClientPriority('1', 'high');

      const client = useDeviceStore.getState().clientList.find(c => c.id === '1');
      expect(client?.priority).toBe('high');
    });
  });

  describe('kickClient', () => {
    it('should remove client from list', async () => {
      useDeviceStore.setState({ clientList: mockClientList });
      (kickClientApi as jest.Mock).mockResolvedValueOnce(undefined);

      await useDeviceStore.getState().kickClient('1');

      const clientList = useDeviceStore.getState().clientList;
      expect(clientList).toHaveLength(1);
      expect(clientList.find(c => c.id === '1')).toBeUndefined();
    });
  });

  describe('setConnectionStatus', () => {
    it('should set connection status', () => {
      useDeviceStore.getState().setConnectionStatus('connected');
      expect(useDeviceStore.getState().connectionStatus).toBe('connected');

      useDeviceStore.getState().setConnectionStatus('connecting');
      expect(useDeviceStore.getState().connectionStatus).toBe('connecting');

      useDeviceStore.getState().setConnectionStatus('disconnected');
      expect(useDeviceStore.getState().connectionStatus).toBe('disconnected');
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      useDeviceStore.setState({ error: 'Some error' });
      
      useDeviceStore.getState().clearError();
      
      expect(useDeviceStore.getState().error).toBeNull();
    });
  });
});
