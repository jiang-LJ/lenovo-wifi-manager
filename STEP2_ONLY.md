# 🏗️ 方案2：Android Studio 本地构建（跳过方案1）

由于方案1闪退，直接使用方案2进行本地构建。

---

## 📋 前置条件

✅ Node.js 已安装 (v24.13.0)
✅ Java 已安装 (v19.0.2)
✅ 项目代码已准备

❌ Android Studio（需要安装）
❌ Android SDK（需要安装）

---

## 🚀 安装步骤

### 第一步：下载 Android Studio（15分钟）

1. **访问官网**
   ```
   https://developer.android.com/studio
   ```

2. **点击下载**
   - 点击大绿色按钮 "Download Android Studio"
   - 同意条款
   - 下载 `android-studio-xxx-windows.exe`（约 1GB）

3. **运行安装**
   ```
   双击下载的 exe 文件
   → Next
   → Next（保持默认路径）
   → Install
   → 等待安装完成（约10分钟）
   → Finish
   ```

---

### 第二步：首次启动配置（10分钟）

1. **启动 Android Studio**
   - 桌面找到 Android Studio 图标，双击打开

2. **导入设置**
   - 选择 "Do not import settings"
   - 点击 OK

3. **安装类型**
   - 选择 "Standard"
   - 点击 Next

4. **选择主题**
   - Darcula（深色）或 Light（浅色）
   - 点击 Next

5. **验证设置**
   - 直接点击 Finish

6. **下载组件**
   - 等待下载 Android SDK（约10分钟）
   - 完成后点击 Finish

---

### 第三步：安装 SDK 组件（10分钟）

1. **打开 SDK Manager**
   ```
   Android Studio → Tools → SDK Manager
   ```

2. **安装 SDK Platforms**
   ```
   点击 "SDK Platforms" 标签
   勾选:
   ☑️ Android 13.0 ("Tiramisu") API 33
   ☑️ Android 12.0 ("S") API 31
   ```

3. **安装 SDK Tools**
   ```
   点击 "SDK Tools" 标签
   勾选:
   ☑️ Android SDK Build-Tools 33
   ☑️ Android SDK Command-line Tools (latest)
   ☑️ Android SDK Platform-Tools
   ☑️ Android Emulator（可选）
   ```

4. **应用安装**
   ```
   点击 Apply
   点击 OK
   等待下载完成（约10分钟）
   ```

---

### 第四步：配置环境变量（5分钟）

1. **打开系统属性**
   ```
   右键 "此电脑" → 属性 → 高级系统设置 → 环境变量
   ```

2. **新建 ANDROID_HOME**
   ```
   点击 "新建"（系统变量）
   
   变量名：ANDROID_HOME
   变量值：C:\Users\你的用户名\AppData\Local\Android\Sdk
   
   注意：替换 "你的用户名" 为实际用户名
   ```

3. **编辑 Path**
   ```
   找到 "Path" 变量，点击 "编辑"
   点击 "新建"，添加：
   %ANDROID_HOME%\platform-tools
   
   再点击 "新建"，添加：
   %ANDROID_HOME%\cmdline-tools\latest\bin
   ```

4. **保存**
   ```
   点击 确定 → 确定 → 确定
   ```

5. **验证**
   ```
   打开新的 PowerShell 窗口
   输入: adb --version
   应该显示版本号
   ```

---

### 第五步：构建 APK（10分钟）

1. **打开 PowerShell**
   ```powershell
   cd D:\BC\WIFI
   ```

2. **运行构建脚本**
   ```powershell
   .\scripts\build-android.bat
   ```

3. **等待构建**
   - 首次构建会下载 Gradle（约5分钟）
   - 然后编译 APK（约5分钟）
   - 看到 "BUILD SUCCESSFUL" 表示成功

4. **获取 APK**
   ```
   输出路径: android\app\build\outputs\apk\release\
   
   文件:
   - app-universal-release.apk      (通用版，约50MB)
   - app-arm64-v8a-release.apk      (华为P60Pro版，约35MB)
   ```

5. **复制到 D:\down**
   ```powershell
   mkdir D:\down 2>$null
   copy android\app\build\outputs\apk\release\*.apk D:\down\
   ```

---

## ✅ 完成验证

检查 D:\down 文件夹：
```powershell
dir D:\down\*.apk
```

应该看到：
```
app-arm64-v8a-release.apk
app-universal-release.apk
```

---

## ❗ 常见问题

### Q1: sdkmanager 找不到？
**解决**: 检查环境变量 Path 是否正确配置

### Q2: Gradle 下载很慢？
**解决**: 修改 `android/build.gradle`，添加国内镜像

### Q3: 构建失败，提示 license？
**解决**: 运行 `sdkmanager --licenses` 并接受所有协议

### Q4: 内存不足？
**解决**: 修改 `gradle.properties`，增加内存配置：
```
org.gradle.jvmargs=-Xmx4096m
```

---

## 📞 需要帮助？

如果遇到困难：
1. 查看详细文档：`BUILD_LOCAL.md`
2. 运行诊断脚本：`scripts/check-env.bat`
3. 搜索错误信息，或询问开发者朋友

---

## 🎯 总结

**预计总时间：40-50 分钟**
- 下载安装：15分钟
- 首次配置：10分钟
- SDK 安装：10分钟
- 环境变量：5分钟
- 构建 APK：10分钟

**完成后您将有：**
- Android Studio 开发环境
- 本地构建 APK 的能力
- 两个 APK 文件（通用版 + 华为P60Pro版）

**现在开始第一步：下载 Android Studio！**
