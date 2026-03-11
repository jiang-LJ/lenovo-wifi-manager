/**
 * Metro配置
 * React Native打包配置
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    // 支持的文件扩展名
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    // 平台扩展名
    platforms: ['ios', 'android', 'windows'],
  },
  // 转换器配置
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // 服务器配置
  server: {
    port: 8081,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
