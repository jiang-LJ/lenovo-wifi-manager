# 🚀 快速打包指南

## Android APK（华为 P60 Pro）

### 一键打包命令

```bash
# Windows
scripts\build-android.bat

# Mac/Linux
chmod +x scripts/build-android.sh
./scripts/build-android.sh
```

### 输出文件
| 文件名 | 说明 | 大小 |
|--------|------|------|
| `app-universal-release.apk` | 通用版（推荐） | ~50MB |
| `app-arm64-v8a-release.apk` | 华为 P60 Pro 专用 | ~35MB |

### 安装到手机
```bash
adb install android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

---

## Windows EXE

### 方式1: MSIX 安装包（推荐）

```bash
scripts\build-windows.bat
```

**输出**: `windows/LenovoWiFiManager/AppPackages/*.msix`

**安装**: 双击安装或使用 PowerShell:
```powershell
Add-AppxPackage -Path "联想WiFi管理.msix"
```

### 方式2: 便携版 EXE

```bash
scripts\build-portable.bat
```

**输出**: `dist/联想WiFi管理-便携版-1.0.0.exe`

**特点**: 免安装，双击直接运行

---

## 环境要求

### Android 打包需要
- [ ] Node.js 18+
- [ ] Java JDK 11+
- [ ] Android SDK

### Windows 打包需要
- [ ] Visual Studio 2022
- [ ] Windows SDK 10/11
- [ ] C++ 桌面开发工作负载

---

## 目录结构

```
📦 打包输出
├── 📱 Android
│   ├── app-universal-release.apk        # 通用版
│   └── app-arm64-v8a-release.apk        # 华为 P60 Pro
│
└── 🪟 Windows
    ├── 联想WiFi管理.msix                # 商店安装包
    └── 联想WiFi管理-便携版.exe          # 便携版
```

---

## ⚡ 最快路径

| 目标 | 命令 | 时间 |
|------|------|------|
| Android APK | `scripts\build-android.bat` | 5-10 分钟 |
| Windows MSIX | `scripts\build-windows.bat` | 10-15 分钟 |

---

## 📦 手动下载预编译版本

如果本地打包环境配置困难，可以使用 GitHub Actions 自动构建：

1. 推送标签: `git tag v1.0.0 && git push origin v1.0.0`
2. 在 [Releases](../../releases) 页面下载

或访问 Actions 页面手动触发构建。
