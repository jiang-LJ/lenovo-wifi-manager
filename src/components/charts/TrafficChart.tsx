/**
 * 流量统计图表组件
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { TrafficRecord } from '../../types';
import { formatFileSize } from '../../utils/format';

const screenWidth = Dimensions.get('window').width;

interface TrafficChartProps {
  type: 'daily' | 'weekly' | 'monthly';
  data: TrafficRecord | Array<{ date: string; upload: number; download: number }>;
  height?: number;
}

export const TrafficChart: React.FC<TrafficChartProps> = ({
  type,
  data,
  height = 220,
}) => {
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(230, 0, 18, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#E60012',
    },
  };

  const renderDailyChart = () => {
    if (!data || !('hourlyData' in data)) return null;
    
    const hourlyData = data.hourlyData;
    const labels = hourlyData.map((_, index) => `${index}时`).filter((_, i) => i % 4 === 0);
    const downloadData = hourlyData.map(h => h.download);
    const uploadData = hourlyData.map(h => h.upload);

    const chartData = {
      labels,
      datasets: [
        {
          data: downloadData,
          color: (opacity = 1) => `rgba(230, 0, 18, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: uploadData,
          color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['下载', '上传'],
    };

    return (
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  const renderWeeklyChart = () => {
    if (!Array.isArray(data)) return null;
    
    const labels = data.map(d => d.date.slice(5)); // MM-DD
    const downloadData = data.map(d => d.download);
    const uploadData = data.map(d => d.upload);

    const chartData = {
      labels,
      datasets: [
        {
          data: downloadData,
          color: (opacity = 1) => `rgba(230, 0, 18, ${opacity})`,
        },
        {
          data: uploadData,
          color: (opacity = 1) => `rgba(0, 200, 83, ${opacity})`,
        },
      ],
      legend: ['下载', '上传'],
    };

    return (
      <BarChart
        data={chartData}
        width={screenWidth - 64}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
        yAxisLabel=""
        yAxisSuffix="MB"
      />
    );
  };

  const renderMonthlyChart = () => {
    if (!Array.isArray(data)) return null;
    
    const labels = data.filter((_, i) => i % 5 === 0).map(d => d.date.slice(8)); // DD
    const downloadData = data.map(d => d.download);

    const chartData = {
      labels,
      datasets: [
        {
          data: downloadData,
          color: (opacity = 1) => `rgba(230, 0, 18, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    return (
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'daily':
        return renderDailyChart();
      case 'weekly':
        return renderWeeklyChart();
      case 'monthly':
        return renderMonthlyChart();
      default:
        return null;
    }
  };

  const renderStats = () => {
    if (type === 'daily' && data && 'hourlyData' in data) {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>下载</Text>
            <Text style={[styles.statValue, { color: '#E60012' }]}>
              {formatFileSize(data.totalDownload * 1024 * 1024)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>上传</Text>
            <Text style={[styles.statValue, { color: '#00C853' }]}>
              {formatFileSize(data.totalUpload * 1024 * 1024)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>总计</Text>
            <Text style={styles.statValue}>
              {formatFileSize((data.totalDownload + data.totalUpload) * 1024 * 1024)}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderStats()}
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chart: {
    borderRadius: 12,
  },
});

export default TrafficChart;
