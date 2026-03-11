/**
 * 状态标签组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'success';
  text?: string;
}

const statusConfig = {
  online: {
    backgroundColor: '#E8F5E9',
    color: '#00C853',
    defaultText: '在线',
  },
  offline: {
    backgroundColor: '#FFEBEE',
    color: '#FF1744',
    defaultText: '离线',
  },
  warning: {
    backgroundColor: '#FFF8E1',
    color: '#FFA000',
    defaultText: '警告',
  },
  error: {
    backgroundColor: '#FFEBEE',
    color: '#FF1744',
    defaultText: '错误',
  },
  success: {
    backgroundColor: '#E8F5E9',
    color: '#00C853',
    defaultText: '成功',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
}) => {
  const config = statusConfig[status];

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>
        {text || config.defaultText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StatusBadge;
