/**
 * 加载状态组件
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';

interface LoadingProps {
  visible: boolean;
  text?: string;
  overlay?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  visible,
  text = '加载中...',
  overlay = true,
}) => {
  const content = (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E60012" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          {content}
        </View>
      </Modal>
    );
  }

  return visible ? content : null;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});

export default Loading;
