/**
 * 设备状态概览卡片
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, StatusBadge } from '../common';
import { DeviceStatus } from '../../types';
import { formatDuration, formatFileSize } from '../../utils/format';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DeviceCardProps {
  deviceStatus: DeviceStatus | null;
  batteryLevel?: number;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  deviceStatus,
  batteryLevel,
}) => {
  if (!deviceStatus) {
    return (
      <Card style={styles.container}>
        <Text style={styles.loadingText}>加载中...</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>设备状态</Text>
          <Text style={styles.subtitle}>{deviceStatus.ssid}</Text>
        </View>
        <StatusBadge status={deviceStatus.isOnline ? 'online' : 'offline'} />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Icon name="wifi" size={24} color="#E60012" />
          <Text style={styles.statValue}>{deviceStatus.connectedClients}</Text>
          <Text style={styles.statLabel}>连接设备</Text>
        </View>

        <View style={styles.statItem}>
          <Icon name="signal" size={24} color="#00C853" />
          <Text style={styles.statValue}>{deviceStatus.signalStrength}%</Text>
          <Text style={styles.statLabel}>信号强度</Text>
        </View>

        {batteryLevel !== undefined && (
          <View style={styles.statItem}>
            <Icon 
              name={batteryLevel > 20 ? 'battery' : 'battery-alert'} 
              size={24} 
              color={batteryLevel > 20 ? '#00C853' : '#FF1744'} 
            />
            <Text style={[styles.statValue, batteryLevel <= 20 && styles.warningText]}>
              {batteryLevel}%
            </Text>
            <Text style={styles.statLabel}>电量</Text>
          </View>
        )}

        <View style={styles.statItem}>
          <Icon name="clock-outline" size={24} color="#666" />
          <Text style={styles.statValue} numberOfLines={1}>
            {formatDuration(deviceStatus.uptime)}
          </Text>
          <Text style={styles.statLabel}>运行时长</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.trafficRow}>
        <View style={styles.trafficItem}>
          <Icon name="arrow-down" size={20} color="#E60012" />
          <Text style={styles.trafficValue}>
            {formatFileSize(deviceStatus.totalDownload * 1024 * 1024)}
          </Text>
          <Text style={styles.trafficLabel}>总下载</Text>
        </View>
        <View style={styles.trafficItem}>
          <Icon name="arrow-up" size={20} color="#00C853" />
          <Text style={styles.trafficValue}>
            {formatFileSize(deviceStatus.totalUpload * 1024 * 1024)}
          </Text>
          <Text style={styles.trafficLabel}>总上传</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  warningText: {
    color: '#FF1744',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trafficItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trafficValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  trafficLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default DeviceCard;
