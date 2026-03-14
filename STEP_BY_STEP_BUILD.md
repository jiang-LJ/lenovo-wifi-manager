# 📋 分步构建指南

## 执行顺序
1. ✅ **方案1**: EAS Build（云端构建，约15分钟）
2. ⏳ **等待方案1完成**
3. ✅ **方案2**: 本地 Android Studio（环境配置，约30分钟）

---

# 🚀 第一步：EAS Build 云端构建

## 预计时间：15-20 分钟

### 准备工作（2分钟）

1. **注册 Expo 账号**（如果还没有）
   - 访问：https://expo.dev/signup
   - 使用邮箱或 GitHub 账号注册
   - 免费账号即可

2. **确认本地环境**
   - Node.js 已安装（您的环境 ✅ v24.13.0）
   - npm 已安装（您的环境 ✅ v11.6.2）

### 执行构建（13-18分钟）

打开 PowerShell 或命令提示符，逐行执行：

```powershell
# 1. 进入项目目录
cd D:\BC\WIFI

# 2. 安装 EAS CLI（全局安装，只需一次）
npm install -g eas-cli

# 3. 登录 Expo（按提示输入账号密码）
eas login

# 4. 初始化项目（按提示确认）
eas init

# 5. 开始构建 Android APK
eas build -p android --profile preview

# 6. 选择构建方式（按提示选择）
#    - 选择 "managed" 工作流
#    - 确认项目配置
```

### 等待构建完成

- 构建时间：约 **10-15 分钟**
- 您会看到进度条和日志输出
- 构建完成后会显示下载链接

### 下载 APK

```powershell
# 下载 APK 到 D:\down 文件夹
# 方式1: 使用 EAS CLI 自动下载
eas build:download

# 方式2: 手动下载
# 浏览器访问提示的链接，下载 APK 到 D:\down
```

### ✅ 方案1完成验证

检查文件是否存在：
```powershell
dir D:\down\*.apk
```

如果看到类似文件，说明方案1成功：
```
联想WiFi管理-xxx.apk
```

---

# 🏗️ 第二步：本地 Android Studio 环境

## 预计时间：30-40 分钟

### 阶段 1：下载安装（15分钟）

1. **下载 Android Studio**
   - 访问：https://developer.android.com/studio
   - 点击 "Download Android Studio"
   - 下载 `.exe` 安装包（约 1GB）

2. **安装 Android Studio**
   ```
   双击下载的安装包
   → Next → Next → Install
   → 等待安装完成（约 10 分钟）
   → Finish
   ```

3. **首次启动配置**
   ```
   打开 Android Studio
   → 选择 "Do not import settings"
   → Next → Standard
   → 选择主题（Darcula/Light）
   → Next → Finish
   → 等待下载组件（约 10 分钟）
   ```

### 阶段 2：安装 SDK 组件（10分钟）

1. **打开 SDK Manager**
   ```
   Android Studio → Tools → SDK Manager
   ```

2. **安装必要组件**（勾选以下项目）
   ```
   SDK Platforms:
   ✅ Android 13.0 ("Tiramisu") API 33
   ✅ Android SDK Platform 33
   
   SDK Tools:
   ✅ Android SDK Build-Tools 33
   ✅ Android SDK Command-line Tools
   ✅ Android Emulator
   ✅ Android SDK Platform-Tools
   ```

3. **点击 Apply → OK**，等待下载完成

### 阶段 3：配置环境变量（5分钟）

1. **打开环境变量设置**
   ```
   右键 "此电脑" → 属性 → 高级系统设置
   → 环境变量 → 系统变量
   ```

2. **新建 ANDROID_HOME**
   ```
   变量名：ANDROID_HOME
   变量值：C:\Users\您的用户名\AppData\Local\Android\Sdk
   ```

3. **编辑 Path 变量，添加**
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\cmdline-tools\latest\bin
   ```

4. **验证配置**
   ```powershell
   # 关闭并重新打开 PowerShell
   echo $env:ANDROID_HOME
   adb --version
   ```

### 阶段 4：本地构建 APK（10分钟）

```powershell
# 1. 进入项目目录
cd D:\BC\WIFI

# 2. 运行构建脚本
.\scripts\build-android.bat

# 3. 等待构建完成
# 第一次构建会下载 Gradle（约 5 分钟）
# 然后编译 APK（约 5 分钟）
```

### ✅ 方案2完成验证

检查输出文件：
```powershell
dir D:\BC\WIFI\android\app\build\outputs\apk\release\
```

应该看到：
```
app-universal-release.apk      (通用版)
app-arm64-v8a-release.apk      (华为 P60 Pro)
```

复制到 D:\down：
```powershell
copy D:\BC\WIFI\android\app\build\outputs\apk\release\*.apk D:\down\
```

---

# 📝 执行清单

## 第一步：EAS Build（云端）
- [ ] 注册 Expo 账号
- [ ] 安装 EAS CLI
- [ ] 登录 Expo
- [ ] 初始化项目
- [ ] 执行构建命令
- [ ] 等待 10-15 分钟
- [ ] 下载 APK 到 D:\down
- [ ] **验证文件存在**

## 第二步：Android Studio（本地）
- [ ] 下载 Android Studio
- [ ] 安装并配置
- [ ] 安装 SDK 组件
- [ ] 配置环境变量
- [ ] 运行本地构建
- [ ] **验证 APK 生成**

---

# 🎯 完成后的状态

执行完两个方案后，您的 D:\down 文件夹将有：

```
D:\down\
├── 联想WiFi管理-xxx.apk          (来自 EAS Build)
├── app-universal-release.apk     (来自本地构建)
└── app-arm64-v8a-release.apk     (华为 P60 Pro 专用)
```

---

# ⚡ 快速命令参考

## 方案1快速命令
```powershell
cd D:\BC\WIFI
npm install -g eas-cli
eas login
eas init
eas build -p android --profile preview
```

## 方案2快速命令
```powershell
# 安装 Android Studio 后
cd D:\BC\WIFI
.\scripts\build-android.bat
```

---

# ❓ 常见问题

### 方案1问题

**Q: EAS 构建失败？**
A: 检查 `app.json` 中的配置，确保 bundleIdentifier 正确

**Q: 下载链接打不开？**
A: 使用 `eas build:list` 查看最新构建状态

### 方案2问题

**Q: sdkmanager 找不到？**
A: 确保 ANDROID_HOME 和 Path 环境变量正确配置

**Q: Gradle 下载慢？**
A: 修改 `android/build.gradle`，使用国内镜像源

---

# ✅ 下一步操作

**现在开始执行第一步（EAS Build）：**

1. 打开浏览器，访问 https://expo.dev/signup
2. 注册账号
3. 打开 PowerShell，执行上面的命令
4. 等待构建完成

**方案1完成后**，再开始第二步（安装 Android Studio）！

祝构建顺利！🎉
