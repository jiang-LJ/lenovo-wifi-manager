/**
 * 网速仪表盘组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface SpeedometerProps {
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  ping: number; // ms
}

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const Speedometer: React.FC<SpeedometerProps> = ({
  downloadSpeed,
  uploadSpeed,
  ping,
}) => {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // 最大速度假设为1000Mbps
  const maxSpeed = 1000;
  const downloadProgress = Math.min(downloadSpeed / maxSpeed, 1);
  // const uploadProgress = Math.min(uploadSpeed / maxSpeed, 1);

  const downloadStrokeDashoffset = circumference * (1 - downloadProgress);
  // const uploadStrokeDashoffset = circumference * (1 - uploadProgress);

  return (
    <View style={styles.container}>
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 背景圆环 */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EEEEEE"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* 下载速度圆环 */}
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E60012"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={downloadStrokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        <View style={styles.centerContent}>
          <Text style={styles.speedValue}>{downloadSpeed.toFixed(1)}</Text>
          <Text style={styles.speedUnit}>Mbps</Text>
          <Text style={styles.speedLabel}>下载</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{uploadSpeed.toFixed(1)}</Text>
          <Text style={styles.statUnit}>Mbps</Text>
          <Text style={styles.statLabel}>上传</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{ping}</Text>
          <Text style={styles.statUnit}>ms</Text>
          <Text style={styles.statLabel}>延迟</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  speedValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E60012',
  },
  speedUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  speedLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    minWidth: 100,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default Speedometer;
