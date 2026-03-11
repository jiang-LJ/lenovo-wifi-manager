/**
 * 网络测速页面
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Speedometer } from '../components/charts';
import { Card, Button } from '../components/common';
import { useSpeedTestStore } from '../store/speedTestStore';
import { formatDate } from '../utils/format';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SpeedTestScreen: React.FC = () => {
  const {
    currentTest,
    testHistory,
    isTesting,
    testProgress,
    runSpeedTest,
    fetchTestHistory,
    clearHistory,
  } = useSpeedTestStore();

  useEffect(() => {
    fetchTestHistory();
  }, []);

  const handleTest = () => {
    runSpeedTest();
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <ScrollView style={styles.container}>
      {/* 测速仪表盘 */}
      <Card style={styles.gaugeCard}>
        {isTesting ? (
          <View style={styles.testingContainer}>
            <Text style={styles.testingText}>正在测速...</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${testProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(testProgress)}%</Text>
          </View>
        ) : currentTest ? (
          <Speedometer
            downloadSpeed={currentTest.downloadSpeed}
            uploadSpeed={currentTest.uploadSpeed}
            ping={currentTest.pingMs}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Icon name="speedometer" size={64} color="#DDD" />
            <Text style={styles.placeholderText}>点击开始测速</Text>
          </View>
        )}

        <Button
          title={isTesting ? '测速中...' : '开始测速'}
          onPress={handleTest}
          loading={isTesting}
          disabled={isTesting}
          size="large"
          style={styles.testButton}
        />
      </Card>

      {/* 测速说明 */}
      <View style={styles.tipsContainer}>
        <Icon name="information" size={16} color="#666" />
        <Text style={styles.tipsText}>
          测速时会消耗一定流量，建议在WiFi环境下进行
        </Text>
      </View>

      {/* 历史记录 */}
      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>历史记录</Text>
          {testHistory.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearText}>清除记录</Text>
            </TouchableOpacity>
          )}
        </View>

        {testHistory.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>暂无测速记录</Text>
          </Card>
        ) : (
          testHistory.map((record, index) => (
            <Card key={record.id || index} style={styles.historyItem}>
              <View style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>
                    {formatDate(record.timestamp, 'MM-DD HH:mm')}
                  </Text>
                  <View style={styles.pingContainer}>
                    <Icon name="timer-outline" size={14} color="#666" />
                    <Text style={styles.pingText}>{record.pingMs}ms</Text>
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <View style={styles.speedRow}>
                    <Icon name="arrow-down" size={16} color="#E60012" />
                    <Text style={styles.speedText}>
                      {record.downloadSpeed.toFixed(1)} Mbps
                    </Text>
                  </View>
                  <View style={styles.speedRow}>
                    <Icon name="arrow-up" size={16} color="#00C853" />
                    <Text style={styles.speedText}>
                      {record.uploadSpeed.toFixed(1)} Mbps
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gaugeCard: {
    margin: 16,
    alignItems: 'center',
  },
  testingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  testingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  progressBar: {
    width: 200,
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E60012',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 48,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  testButton: {
    width: '100%',
    marginTop: 16,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tipsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  historySection: {
    marginHorizontal: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  clearText: {
    fontSize: 14,
    color: '#E60012',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  historyItem: {
    marginBottom: 8,
    padding: 12,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  pingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  speedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 4,
  },
});

export default SpeedTestScreen;
