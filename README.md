# 联想无线WiFi管理应用

一款面向联想无线WiFi设备的跨平台管理应用，支持Windows 11桌面端和华为P60 Pro移动端，提供便捷的设备管理、网络监控和高级分析功能。

## 功能特性

### 基础功能
- 🔐 设备连接与认证（自动发现、登录、记住密码、自动登录）
- 📊 设备状态概览（在线状态、信号强度、运行时长、电量显示）
- 👥 连接设备管理（设备列表、限速、拉黑、优先级设置）

### 高级功能
- 📈 流量统计系统（日/周/月统计、设备维度排行）
- 🚀 网络测速功能（下载/上传速度、延迟、抖动、丢包率）
- ⚙️ WiFi设置管理（SSID、密码、信道、访客网络、MAC过滤）

### 特色功能
- 🔔 智能通知中心（新设备接入、流量超限、电量低、固件更新）
- 🌙 深色模式支持
- 🔒 密码AES-256加密存储

## 技术栈

- **框架**: React Native 0.73 + TypeScript
- **状态管理**: Zustand
- **网络请求**: Axios
- **本地存储**: AsyncStorage + SQLite
- **UI组件**: React Native Paper
- **图表**: react-native-chart-kit

## 支持平台

- Windows 11 (x64)
- Android 13 / HarmonyOS 4.0+

## 安装运行

### 环境要求
- Node.js >= 18
- Java Development Kit (JDK) >= 11
- Android Studio (Android开发)
- Visual Studio 2022 (Windows开发)

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd lenovo-wifi-manager

# 安装依赖
npm install

# iOS依赖 (Mac only)
cd ios && pod install && cd ..
```

### 运行应用

```bash
# Android
npm run android

# Windows
npm run windows

# 启动Metro服务
npm start
```

### 打包发布

```bash
# Android Release APK
cd android && ./gradlew assembleRelease

# Windows Release
# 使用Visual Studio打开windows/lenovo-wifi-manager.sln进行打包
```

## 项目结构

```
lenovo-wifi-manager/
├── src/
│   ├── api/              # HTTP请求封装
│   ├── components/       # UI组件
│   │   ├── common/       # 通用组件
│   │   ├── charts/       # 图表组件
│   │   └── device/       # 设备组件
│   ├── screens/          # 页面组件
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义Hooks
│   ├── types/            # TypeScript类型
│   └── navigation/       # 导航配置
├── android/              # Android原生代码
├── windows/              # Windows原生代码
├── App.tsx               # 应用入口
└── package.json
```

## 配置说明

### 默认设备信息
- 管理地址: `192.168.0.1`
- 默认用户名: `admin`
- 默认密码: `admin`

### API接口
详见 `src/api/` 目录下的接口定义。

## 开发计划

### Phase 1: MVP（2周）
- [x] 项目搭建与跨平台配置
- [x] 登录认证模块
- [x] 基础状态显示
- [x] 设备列表查看

### Phase 2: 核心功能（3周）
- [x] 流量统计图表
- [x] 网络测速功能
- [x] 设备管理（限速、拉黑）
- [x] 密码存储与自动登录

### Phase 3: 优化与发布（2周）
- [ ] UI/UX细节打磨
- [ ] 性能优化
- [ ] 多语言支持
- [ ] 应用打包与签名

## 许可证

MIT License

## 致谢

- React Native 团队
- 联想官方路由器管理页面
