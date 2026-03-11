/**
 * 连接设备列表项组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClientDevice } from '../../types';
import { formatSpeed, formatDuration, formatMacAddress } from '../../utils/format';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ClientListItemProps {
  client: ClientDevice;
  onPress?: (client: ClientDevice) => void;
  onBlock?: (client: ClientDevice) => void;
  onLimit?: (client: ClientDevice) => void;
}

const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case 'phone':
      return 'cellphone';
    case 'computer':
      return 'laptop';
    case 'iot':
      return 'home-automation';
    default:
      return 'devices';
  }
};

export const ClientListItem: React.FC<ClientListItemProps> = ({
  client,
  onPress,
  onBlock,
  onLimit,
}) => {
  const displayName = client.customName || client.name || '未知设备';
  const isOnline = client.isOnline;

  return (
    <TouchableOpacity
      style={[styles.container, !isOnline && styles.offlineContainer]}
      onPress={() => onPress?.(client)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={getDeviceIcon(client.deviceType)}
          size={28}
          color={isOnline ? '#E60012' : '#999'}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, !isOnline && styles.offlineText]}>
            {displayName}
          </Text>
          {client.isBlocked && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>已拉黑</Text>
            </View>
          )}
          {client.speedLimit > 0 && (
            <View style={[styles.badge, styles.limitBadge]}>
              <Text style={[styles.badgeText, styles.limitBadgeText]}>
                限速 {formatSpeed(client.speedLimit)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.macAddress}>{formatMacAddress(client.macAddress)}</Text>
        <Text style={styles.ipAddress}>{client.ipAddress}</Text>

        {isOnline && (
          <View style={styles.speedRow}>
            <View style={styles.speedItem}>
              <Icon name="arrow-down" size={14} color="#E60012" />
              <Text style={styles.speedText}>{formatSpeed(client.downloadSpeed)}</Text>
            </View>
            <View style={styles.speedItem}>
              <Icon name="arrow-up" size={14} color="#00C853" />
              <Text style={styles.speedText}>{formatSpeed(client.uploadSpeed)}</Text>
            </View>
            <Text style={styles.duration}>
              已连接 {formatDuration(client.connectedTime)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLimit?.(client)}
        >
          <Icon name="speedometer" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onBlock?.(client)}
        >
          <Icon
            name={client.isBlocked ? 'account-check' : 'account-cancel'}
            size={20}
            color={client.isBlocked ? '#00C853' : '#FF1744'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  offlineContainer: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  offlineText: {
    color: '#999',
  },
  badge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#FF1744',
    fontWeight: '500',
  },
  limitBadge: {
    backgroundColor: '#FFF8E1',
  },
  limitBadgeText: {
    color: '#FFA000',
  },
  macAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ipAddress: {
    fontSize: 12,
    color: '#999',
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  speedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  speedText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  duration: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ClientListItem;
