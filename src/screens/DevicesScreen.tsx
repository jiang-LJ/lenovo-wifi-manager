/**
 * 设备管理页面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { ClientListItem } from '../components/device';
import { Button, Card, Input } from '../components/common';
import { useDeviceStore } from '../store/deviceStore';
import { ClientDevice } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const DevicesScreen: React.FC = () => {
  const {
    clientList,
    isLoading,
    syncAllData,
    updateClientName,
    setClientSpeedLimit,
    blockClient,
    unblockClient,
    // kickClient,
  } = useDeviceStore();

  const [selectedClient, setSelectedClient] = useState<ClientDevice | null>(null);
  const [editName, setEditName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [speedLimit, setSpeedLimit] = useState('');

  const onRefresh = () => {
    syncAllData();
  };

  const handleEditName = (client: ClientDevice) => {
    setSelectedClient(client);
    setEditName(client.customName || client.name || '');
    setShowEditModal(true);
  };

  const saveName = async () => {
    if (selectedClient && editName.trim()) {
      await updateClientName(selectedClient.id, editName.trim());
      setShowEditModal(false);
      setSelectedClient(null);
    }
  };

  const handleLimit = (client: ClientDevice) => {
    setSelectedClient(client);
    setSpeedLimit(client.speedLimit > 0 ? String(client.speedLimit) : '');
    setShowLimitModal(true);
  };

  const saveLimit = async () => {
    if (selectedClient) {
      const limit = speedLimit.trim() ? parseInt(speedLimit, 10) : 0;
      await setClientSpeedLimit(selectedClient.id, limit);
      setShowLimitModal(false);
      setSelectedClient(null);
    }
  };

  const handleBlock = (client: ClientDevice) => {
    const action = client.isBlocked ? '解禁' : '拉黑';
    Alert.alert(
      `确认${action}`,
      `确定要${action}设备 "${client.customName || client.name}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: client.isBlocked ? 'default' : 'destructive',
          onPress: async () => {
            if (client.isBlocked) {
              await unblockClient(client.id);
            } else {
              await blockClient(client.id);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ClientDevice }) => (
    <ClientListItem
      client={item}
      onPress={handleEditName}
      onBlock={handleBlock}
      onLimit={handleLimit}
    />
  );

  const onlineCount = clientList.filter(c => c.isOnline).length;
  const blockedCount = clientList.filter(c => c.isBlocked).length;

  return (
    <View style={styles.container}>
      {/* 统计栏 */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{clientList.length}</Text>
          <Text style={styles.statLabel}>总设备</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#00C853' }]}>{onlineCount}</Text>
          <Text style={styles.statLabel}>在线</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#FF1744' }]}>{blockedCount}</Text>
          <Text style={styles.statLabel}>已拉黑</Text>
        </View>
      </View>

      <FlatList
        data={clientList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Icon name="devices" size={48} color="#CCC" />
            <Text style={styles.emptyText}>暂无设备</Text>
          </Card>
        }
      />

      {/* 编辑名称弹窗 */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑设备名称</Text>
            <Input
              value={editName}
              onChangeText={setEditName}
              placeholder="请输入设备名称"
            />
            <View style={styles.modalButtons}>
              <Button
                title="取消"
                variant="outline"
                onPress={() => setShowEditModal(false)}
              />
              <Button title="保存" onPress={saveName} />
            </View>
          </Card>
        </View>
      </Modal>

      {/* 限速弹窗 */}
      <Modal
        visible={showLimitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLimitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>设置限速 (KB/s)</Text>
            <Input
              value={speedLimit}
              onChangeText={setSpeedLimit}
              placeholder="0表示不限速"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button
                title="取消"
                variant="outline"
                onPress={() => setShowLimitModal(false)}
              />
              <Button title="保存" onPress={saveLimit} />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyCard: {
    margin: 16,
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default DevicesScreen;
