/**
 * 应用导航配置
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { DevicesScreen } from '../screens/DevicesScreen';
import { TrafficScreen } from '../screens/TrafficScreen';
import { SpeedTestScreen } from '../screens/SpeedTestScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

import { useAuthStore } from '../store/authStore';

// 定义导航参数类型
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Devices: undefined;
  Traffic: undefined;
  SpeedTest: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 底部Tab导航
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Devices':
              iconName = focused ? 'devices' : 'devices';
              break;
            case 'Traffic':
              iconName = focused ? 'chart-bar' : 'chart-bar';
              break;
            case 'SpeedTest':
              iconName = focused ? 'speedometer' : 'speedometer';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E60012',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#E60012',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: '仪表盘' }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesScreen}
        options={{ title: '设备管理' }}
      />
      <Tab.Screen
        name="Traffic"
        component={TrafficScreen}
        options={{ title: '流量统计' }}
      />
      <Tab.Screen
        name="SpeedTest"
        component={SpeedTestScreen}
        options={{ title: '网络测速' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '设置' }}
      />
    </Tab.Navigator>
  );
};

// 根导航
export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
