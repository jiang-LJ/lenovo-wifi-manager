module.exports = {
  project: {
    android: {
      sourceDir: './android',
    },
    windows: {
      sourceDir: './windows',
      solutionFile: 'lenovo-wifi-manager.sln',
      project: {
        projectFile: 'LenovoWiFiManager\\LenovoWiFiManager.vcxproj',
      },
    },
  },
  dependencies: {
    'react-native-sqlite-storage': {
      platforms: {
        android: {
          sourceDir: './node_modules/react-native-sqlite-storage/platforms/android',
        },
      },
    },
  },
};
