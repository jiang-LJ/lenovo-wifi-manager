/**
 * 仪表盘页面 - 设备状态概览
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { DeviceCard, ClientListItem } from '../components/device';
import { Card, StatusBadge } from '../components/common';
import { useDeviceStore } from '../store/deviceStore';
import { useTrafficStore } from '../store/trafficStore';
import { formatSpeed } from '../utils/format';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const DashboardScreen: React.FC = () => {
  const {
    deviceStatus,
    batteryInfo,
    clientList,
    isLoading,
    connectionStatus,
    syncAllData,
    fetchDeviceStatus,
  } = useDeviceStore();

  const { realtimeTraffic, fetchRealtimeTraffic } = useTrafficStore();

  const onRefresh = async () => {
    await syncAllData();
    await fetchRealtimeTraffic();
  };

  useEffect(() => {
    onRefresh();
    // 每5秒刷新一次实时数据
    const interval = setInterval(() => {
      fetchDeviceStatus();
      fetchRealtimeTraffic();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineClients = clientList.filter(c => c.isOnline).slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={['#E60012']}
        />
      }
    >
      {/* 设备状态卡片 */}
      <DeviceCard
        deviceStatus={deviceStatus}
        batteryLevel={batteryInfo?.level}
      />

      {/* 实时网速卡片 */}
      <Card style={styles.speedCard}>
        <Text style={styles.cardTitle}>实时网速</Text>
        <View style={styles.speedRow}>
          <View style={styles.speedItem}>
            <View style={[styles.speedIcon, { backgroundColor: '#FFEBEE' }]}>
              <Icon name="arrow-down" size={24} color="#E60012" />
            </View>
            <View>
              <Text style={styles.speedValue}>
                {realtimeTraffic ? formatSpeed(realtimeTraffic.downloadSpeed) : '--'}
              </Text>
              <Text style={styles.speedLabel}>下载速度</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.speedItem}>
            <View style={[styles.speedIcon, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="arrow-up" size={24} color="#00C853" />
            </View>
            <View>
              <Text style={styles.speedValue}>
                {realtimeTraffic ? formatSpeed(realtimeTraffic.uploadSpeed) : '--'}
              </Text>
              <Text style={styles.speedLabel}>上传速度</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* 在线设备 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>在线设备</Text>
          <Text style={styles.sectionSubtitle}>
            {onlineClients.length} 台设备
          </Text>
        </View>
        
        {onlineClients.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>暂无在线设备</Text>
          </Card>
        ) : (
          onlineClients.map(client => (
            <ClientListItem
              key={client.id}
              client={client}
            />
          ))
        )}
      </View>

      {/* 连接状态 */}
      <View style={styles.statusBar}>
        <StatusBadge
          status={connectionStatus === 'connected' ? 'online' : 'offline'}
          text={connectionStatus === 'connected' ? '已连接' : '未连接'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  speedCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  speedValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  speedLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyCard: {
    marginHorizontal: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  statusBar: {
    padding: 16,
    alignItems: 'center',
  },
});

export default DashboardScreen;
