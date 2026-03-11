/**
 * 流量统计页面
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { TrafficChart } from '../components/charts';
import { Card } from '../components/common';
import { useTrafficStore } from '../store/trafficStore';
import { formatFileSize } from '../utils/format';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type PeriodType = 'daily' | 'weekly' | 'monthly';

export const TrafficScreen: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('daily');
  const {
    dailyTraffic,
    weeklyTraffic,
    monthlyTraffic,
    clientTraffic,
    isLoading,
    fetchDailyTraffic,
    fetchWeeklyTraffic,
    fetchMonthlyTraffic,
    fetchClientTraffic,
  } = useTrafficStore();

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    switch (period) {
      case 'daily':
        await fetchDailyTraffic();
        break;
      case 'weekly':
        await fetchWeeklyTraffic();
        break;
      case 'monthly':
        await fetchMonthlyTraffic();
        break;
    }
    const periodMap: Record<PeriodType, 'day' | 'week' | 'month'> = {
      daily: 'day',
      weekly: 'week',
      monthly: 'month',
    };
    await fetchClientTraffic(periodMap[period]);
  };

  const getCurrentData = () => {
    switch (period) {
      case 'daily':
        return dailyTraffic;
      case 'weekly':
        return weeklyTraffic || [];
      case 'monthly':
        return monthlyTraffic?.days || [];
      default:
        return null;
    }
  };

  const getTotalTraffic = () => {
    if (period === 'daily' && dailyTraffic) {
      return dailyTraffic.totalDownload + dailyTraffic.totalUpload;
    }
    if (period === 'weekly' && weeklyTraffic) {
      return weeklyTraffic.reduce((sum, d) => sum + d.download + d.upload, 0);
    }
    if (period === 'monthly' && monthlyTraffic) {
      return monthlyTraffic.totalDownload + monthlyTraffic.totalUpload;
    }
    return 0;
  };

  const periodButtons: { key: PeriodType; label: string }[] = [
    { key: 'daily', label: '今日' },
    { key: 'weekly', label: '本周' },
    { key: 'monthly', label: '本月' },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadData} />
      }
    >
      {/* 周期切换 */}
      <View style={styles.periodSelector}>
        {periodButtons.map(btn => (
          <TouchableOpacity
            key={btn.key}
            style={[
              styles.periodButton,
              period === btn.key && styles.periodButtonActive,
            ]}
            onPress={() => setPeriod(btn.key)}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === btn.key && styles.periodButtonTextActive,
              ]}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 总流量卡片 */}
      <Card style={styles.totalCard}>
        <View style={styles.totalRow}>
          <View style={styles.totalItem}>
            <Icon name="swap-vertical" size={32} color="#E60012" />
            <View style={styles.totalTextContainer}>
              <Text style={styles.totalLabel}>总流量</Text>
              <Text style={styles.totalValue}>
                {formatFileSize(getTotalTraffic() * 1024 * 1024)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* 流量图表 */}
      {getCurrentData() && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>
            {period === 'daily' ? '24小时流量' : period === 'weekly' ? '7天流量' : '30天流量'}
          </Text>
          <TrafficChart
            type={period}
            data={getCurrentData()!}
          />
        </View>
      )}

      {/* 设备流量排行 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设备流量排行</Text>
        {clientTraffic.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>暂无数据</Text>
          </Card>
        ) : (
          clientTraffic.map((client, index) => (
            <Card key={client.macAddress} style={styles.clientCard}>
              <View style={styles.clientRank}>
                <Text style={[
                  styles.rankNumber,
                  index < 3 && styles.rankTop3
                ]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <View style={styles.clientTraffic}>
                  <Text style={styles.trafficText}>
                    ↓ {formatFileSize(client.totalDownload * 1024 * 1024)}
                  </Text>
                  <Text style={styles.trafficText}>
                    ↑ {formatFileSize(client.totalUpload * 1024 * 1024)}
                  </Text>
                </View>
              </View>
              <View style={styles.percentageBar}>
                <View
                  style={[
                    styles.percentageFill,
                    { width: `${client.percentage}%` },
                  ]}
                />
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  periodButtonActive: {
    backgroundColor: '#E60012',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  totalCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalTextContainer: {
    marginLeft: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  chartSection: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  clientRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  rankTop3: {
    color: '#E60012',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  clientTraffic: {
    flexDirection: 'row',
    marginTop: 4,
  },
  trafficText: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  percentageBar: {
    width: 60,
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    backgroundColor: '#E60012',
    borderRadius: 2,
  },
});

export default TrafficScreen;
