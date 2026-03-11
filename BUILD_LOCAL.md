# 🏠 本地打包完整指南

## 环境检查清单

### 当前环境状态
| 组件 | 状态 | 版本 |
|------|------|------|
| Node.js | ✅ 已安装 | v24.13.0 |
| npm | ✅ 已安装 | 11.6.2 |
| Java JDK | ✅ 已安装 | 19.0.2 |
| Android SDK | ❌ 未安装 | - |
| Visual Studio | ❌ 未安装 | - |

---

## 📱 Android APK 打包步骤

### 步骤 1: 安装 Android SDK

#### 方式 A: 通过 Android Studio 安装（推荐）
1. 下载 [Android Studio](https://developer.android.com/studio)
2. 安装时选择:
   - ✅ Android SDK
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Build-Tools
   - ✅ Android 13.0 (API 33)

#### 方式 B: 命令行安装（轻量）
```powershell
# 下载命令行工具
mkdir C:\Android\Sdk
cd C:\Android\Sdk
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-win-9477386_latest.zip" -OutFile "cmdline-tools.zip"
Expand-Archive -Path "cmdline-tools.zip" -DestinationPath "."
mkdir cmdline-tools\latest
move cmdline-tools\bin cmdline-tools\latest\
move cmdline-tools\lib cmdline-tools\latest\

# 设置环境变量
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools", "User")

# 安装必要组件
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### 步骤 2: 配置环境变量
```powershell
# 检查环境变量
$env:ANDROID_HOME
$env:JAVA_HOME

# 如果未设置，手动添加
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\YourName\AppData\Local\Android\Sdk", "User")
```

### 步骤 3: 执行打包
```bash
# 在项目目录下执行
cd d:\BC\WIFI
scripts\build-android.bat
```

### 预期输出
```
android/app/build/outputs/apk/release/
├── app-universal-release.apk      (约 50MB)
└── app-arm64-v8a-release.apk      (约 35MB)  ← 华为 P60 Pro 使用此版本
```

---

## 🪟 Windows EXE 打包步骤

### 步骤 1: 安装 Visual Studio 2022
1. 下载 [Visual Studio Community 2022](https://visualstudio.microsoft.com/)
2. 安装工作负载:
   - ✅ 使用 C++ 的桌面开发
   - ✅ 通用 Windows 平台开发
   - ✅ Windows 10/11 SDK (10.0.19041.0 或更高)

### 步骤 2: 安装 Windows 依赖
```bash
# 在项目目录下
cd d:\BC\WIFI

# 安装 Windows 平台支持
npx react-native-windows-init --overwrite
```

### 步骤 3: 执行打包
```bash
# MSIX 安装包
scripts\build-windows.bat

# 或便携版 EXE
scripts\build-portable.bat
```

### 预期输出
```
windows/LenovoWiFiManager/AppPackages/
└── LenovoWiFiManager_1.0.0.0_x64.msix    (应用商店安装包)

或

dist/
└── 联想WiFi管理-便携版-1.0.0.exe         (便携版)
```

---

## 🌐 云端打包方案（无需本地环境）

如果本地环境配置困难，推荐使用 **GitHub Actions** 自动打包：

### 步骤 1: 创建 GitHub 仓库
```bash
cd d:\BC\WIFI
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/lenovo-wifi-manager.git
git push -u origin main
```

### 步骤 2: 触发自动构建
```bash
# 创建标签触发构建
git tag v1.0.0
git push origin v1.0.0
```

### 步骤 3: 下载构建产物
1. 访问 GitHub 仓库页面
2. 点击 [Actions](../../actions) 标签
3. 等待构建完成
4. 在 [Releases](../../releases) 页面下载 APK 和 EXE

---

## 📦 打包脚本详解

### `build-android.bat`
```batch
@echo off
:: 1. 安装依赖
npm install

:: 2. 清理旧构建
cd android
rd /s /q app\build 2>nul

:: 3. 生成签名密钥（如果不存在）
if not exist "app\release.keystore" (
    keytool -genkeypair -v -keystore "app\release.keystore" ...
)

:: 4. 构建 Release APK
gradlew.bat clean assembleRelease

:: 输出路径: app/build/outputs/apk/release/
```

### `build-windows.bat`
```batch
@echo off
:: 1. 构建 JavaScript Bundle
npx react-native bundle --platform windows ...

:: 2. 使用 MSBuild 构建
cd windows
msbuild LenovoWiFiManager.sln /p:Configuration=Release ...

:: 输出路径: LenovoWiFiManager/AppPackages/
```

---

## 🚀 一键打包命令汇总

### 快速开始（推荐顺序）

```powershell
# 打开 PowerShell，进入项目目录
cd d:\BC\WIFI

# 方案 1: 本地打包 Android（需 Android SDK）
scripts\build-android.bat

# 方案 2: 本地打包 Windows（需 Visual Studio）
scripts\build-windows.bat

# 方案 3: 云端打包（推荐，无需环境配置）
# 1. 推送代码到 GitHub
# 2. 访问 Actions 页面点击 "Run workflow"
```

---

## ❗ 常见问题

### Android 打包问题

**Q: `sdkmanager` 命令找不到**
```powershell
# 解决: 添加到 Path
$env:Path += ";$env:ANDROID_HOME\cmdline-tools\latest\bin"
```

**Q: 构建失败 `Could not find com.android.tools.build:gradle`**
```bash
# 解决: 同步 Gradle
cd android
gradlew.bat --stop
gradlew.bat clean
gradlew.bat assembleRelease
```

### Windows 打包问题

**Q: `MSBuild` 命令找不到**
```powershell
# 解决: 使用 Visual Studio 的 Developer Command Prompt
# 或添加 MSBuild 到 Path:
$env:Path += ";C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin"
```

**Q: React Native Windows 依赖错误**
```bash
# 解决: 重新安装 Windows 支持
npm uninstall react-native-windows
npm install react-native-windows@0.73.0
npx react-native autolink-windows
```

---

## 📋 打包检查清单

打包前确认:
- [ ] `package.json` 中的版本号已更新
- [ ] `android/app/build.gradle` 中的版本号已更新
- [ ] 所有代码已提交到 git
- [ ] 测试通过 (`npm test`)
- [ ] TypeScript 检查通过 (`npx tsc --noEmit`)

---

## 💡 推荐方案

| 场景 | 推荐方案 | 难度 |
|------|----------|------|
| 快速获取安装包 | GitHub Actions 云端打包 | ⭐ 最简单 |
| 频繁本地调试 | 安装 Android Studio + VS 2022 | ⭐⭐⭐ 复杂 |
| 仅 Android | 仅安装 Android SDK 命令行工具 | ⭐⭐ 中等 |

---

## 📞 获取帮助

如遇到打包问题:
1. 查看 `BUILD_GUIDE.md` 完整指南
2. 检查 GitHub Actions 构建日志
3. 查看 React Native 官方文档
