module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Reanimated插件必须放在最后
    'react-native-reanimated/plugin',
  ],
};
