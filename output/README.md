# 📦 构建输出目录

此目录用于存放打包生成的安装文件。

## 目录结构

```
output/
├── android/           # Android APK 文件
│   ├── app-universal-release.apk
│   └── app-arm64-v8a-release.apk
├── windows/           # Windows 安装包
│   ├── 联想WiFi管理.msix
│   └── 联想WiFi管理-便携版.exe
└── README.md          # 本文件
```

## 构建方法

### 方法 1: 本地构建（推荐开发者）
```bash
# Android
scripts\build-android.bat

# Windows  
scripts\build-windows.bat
```

### 方法 2: Docker 构建（无需环境配置）
```bash
# Android APK
docker-build.bat
```

### 方法 3: GitHub Actions（最简单）
1. 推送代码到 GitHub
2. 访问 Actions 页面
3. 下载构建产物

## 安装指南

### 华为 P60 Pro
1. 下载 `app-arm64-v8a-release.apk` 或 `app-universal-release.apk`
2. 传输到手机
3. 点击安装（允许未知来源应用）

### Windows 11
1. **MSIX 安装包**: 双击 `联想WiFi管理.msix` 安装
2. **便携版**: 双击 `联想WiFi管理-便携版.exe` 直接运行
