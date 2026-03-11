# 联想WiFi管理 - 打包构建指南

## 📦 打包方式概览

| 平台 | 格式 | 文件名 | 适用场景 |
|------|------|--------|----------|
| Android | APK (通用) | `app-universal-release.apk` | 所有 Android 设备 |
| Android | APK (ARM64) | `app-arm64-v8a-release.apk` | 华为 P60 Pro 等 ARM64 设备 |
| Windows | MSIX | `*.msix` / `*.appx` | Windows 10/11 应用商店 |
| Windows | 便携 EXE | `联想WiFi管理-便携版.exe` | 免安装直接运行 |

---

## 🤖 Android APK 打包

### 环境要求
- Node.js 18+
- Java JDK 11+
- Android SDK (通过 Android Studio 安装)
- 环境变量 `ANDROID_HOME` 已配置

### 快速打包（自动脚本）

#### Windows
```bash
# 运行自动打包脚本
scripts\build-android.bat
```

#### macOS/Linux
```bash
# 添加执行权限
chmod +x scripts/build-android.sh

# 运行打包脚本
./scripts/build-android.sh
```

### 手动打包步骤

```bash
# 1. 安装依赖
npm install

# 2. 生成签名密钥（仅需执行一次）
cd android/app
keytool -genkeypair -v \
    -storetype PKCS12 \
    -keystore release.keystore \
    -alias lenovo-wifi-manager \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass lenovo2024 \
    -keypass lenovo2024 \
    -dname "CN=Lenovo WiFi Manager, OU=Lenovo, O=Lenovo, L=Beijing, ST=Beijing, C=CN"

cd ../..

# 3. 构建 Release APK
cd android
./gradlew clean assembleRelease

# Windows 使用: gradlew.bat clean assembleRelease
```

### 输出文件

打包完成后，APK 文件位于：
```
android/app/build/outputs/apk/release/
├── app-universal-release.apk      # 通用版（推荐）
├── app-arm64-v8a-release.apk      # ARM64 专用（华为 P60 Pro）
├── app-armeabi-v7a-release.apk    # ARMv7 旧设备
└── app-x86_64-release.apk         # x86_64 模拟器
```

### 安装到华为 P60 Pro

```bash
# 方式1: 使用 ADB 安装
adb install android/app/build/outputs/apk/release/app-arm64-v8a-release.apk

# 方式2: 使用 ADB 安装通用版
adb install android/app/build/outputs/apk/release/app-universal-release.apk

# 方式3: 传输到手机后手动安装
# 通过 USB/微信/QQ 传输 APK 到手机，点击安装
```

### 华为 P60 Pro 特殊说明

- **处理器**: 高通骁龙 8+ Gen 1 (ARM64)
- **系统**: HarmonyOS 4.0+ (兼容 Android 13)
- **推荐 APK**: `app-arm64-v8a-release.apk` 或 `app-universal-release.apk`
- **权限**: 首次安装需在设置中允许"未知来源应用"

---

## 🪟 Windows 打包

### 方式1: MSIX 应用包（推荐）

#### 环境要求
- Visual Studio 2022
- Windows 10/11 SDK
- C++ 桌面开发工作负载
- UWP 开发工作负载

#### 打包步骤

```bash
# 1. 确保依赖已安装
npm install

# 2. 构建 Windows 版本
npx react-native run-windows --arch x64 --release

# 3. 或使用脚本
scripts\build-windows.bat
```

#### 输出文件
```
windows/LenovoWiFiManager/AppPackages/
├── LenovoWiFiManager_1.0.0.0_x64.msix
└── LenovoWiFiManager_1.0.0.0_x64.appx
```

#### 安装方法
```powershell
# 方式1: 双击 .msix 文件安装

# 方式2: PowerShell 命令
Add-AppxPackage -Path ".\LenovoWiFiManager_1.0.0.0_x64.msix"

# 方式3: 应用商店旁加载
# 设置 -> 应用 -> 旁加载应用
```

### 方式2: 便携版 EXE

#### 方法A: 使用 electron-builder

```bash
# 1. 运行便携版构建脚本
scripts\build-portable.bat

# 2. 或使用 npx electron-builder
npx electron-builder --win portable
```

**输出**: `dist/联想WiFi管理-便携版-1.0.0.exe`

#### 方法B: 使用 Enigma Virtual Box（简单）

1. 先构建 React Native Windows 版本
2. 下载 [Enigma Virtual Box](https://www.enigmaprotector.com/en/aboutvb.html)
3. 选择主执行文件和依赖文件夹
4. 打包成单文件 EXE

---

## 📱 一键打包所有平台

### Windows 批处理
```bash
# 创建发布目录
mkdir release

# 构建 Android
echo "Building Android..."
call scripts\build-android.bat

# 复制 APK
copy android\app\build\outputs\apk\release\app-universal-release.apk release\
copy android\app\build\outputs\apk\release\app-arm64-v8a-release.apk release\

# 构建 Windows
echo "Building Windows..."
call scripts\build-windows.bat

# 复制 Windows 包
copy windows\LenovoWiFiManager\AppPackages\*.msix release\

echo "打包完成！文件位于 release/ 目录"
```

---

## 🔧 常见问题

### Android 打包问题

#### 1. `Could not find com.android.tools.build:gradle`
**解决**: 确保 Android SDK 和 Gradle 已正确配置
```bash
cd android
./gradlew --version
```

#### 2. `Keystore file does not exist`
**解决**: 运行签名密钥生成脚本
```bash
cd android/app
keytool -genkeypair -v -keystore release.keystore -alias lenovo-wifi-manager -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. `app:transformNativeLibsWithMergeJniLibsForRelease`
**解决**: 清理构建缓存
```bash
cd android
./gradlew clean
```

### Windows 打包问题

#### 1. `MSB4019: The imported project was not found`
**解决**: 安装 Visual Studio 2022 的 C++ 桌面开发工作负载

#### 2. `Could not find Windows SDK`
**解决**: 通过 Visual Studio Installer 安装 Windows 10/11 SDK

#### 3. `ReactNativeServer autolinking failed`
**解决**: 确保所有依赖已正确安装
```bash
npm install
npx react-native autolink-windows
```

---

## 📋 发布检查清单

### Android APK 发布前检查
- [ ] 版本号已更新 (`android/app/build.gradle`)
- [ ] 签名密钥已生成并妥善保存
- [ ] Release 构建成功
- [ ] 在真机上测试通过
- [ ] 权限声明正确 (`AndroidManifest.xml`)
- [ ] 应用图标已设置

### Windows 发布前检查
- [ ] 应用清单已配置 (`Package.appxmanifest`)
- [ ] 版本号已更新
- [ ] 图标和启动画面已设置
- [ ] 在 Windows 11 上测试通过
- [ ] 网络权限已声明

---

## 📁 文件说明

```
scripts/
├── build-android.bat      # Windows Android 打包脚本
├── build-android.sh       # macOS/Linux Android 打包脚本
├── build-windows.bat      # Windows MSIX 打包脚本
├── build-portable.bat     # Windows 便携版打包脚本
└── generate-android-key.bat  # Android 签名密钥生成

android/app/build.gradle   # Android 构建配置
windows/LenovoWiFiManager/Package.appxmanifest  # Windows 应用清单
```

---

## 🚀 快速开始

### 仅需两条命令打包 Android

```bash
# Windows
call scripts\build-android.bat

# 输出: android/app/build/outputs/apk/release/app-universal-release.apk
```

### 仅需两条命令打包 Windows

```bash
# Windows (需要 Visual Studio)
call scripts\build-windows.bat

# 输出: windows/LenovoWiFiManager/AppPackages/*.msix
```

---

## 📞 技术支持

如遇打包问题，请检查：
1. 环境变量配置 (`ANDROID_HOME`, `JAVA_HOME`)
2. 依赖版本兼容性
3. 构建日志中的具体错误信息
