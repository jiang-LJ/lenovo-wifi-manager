# 📦 Android Studio D盘安装指南

## 安装路径
```
D:\Program Files\Android Studio
```

---

## 阶段 1: 下载安装（15分钟）

### 1. 下载安装包
- 访问：https://developer.android.com/studio
- 点击 **"Download Android Studio"**
- 下载 `.exe` 安装包（约 1GB）

### 2. 运行安装程序
```
1. 双击下载的 android-studio-xxx.exe
2. 点击 "Next"
3. 选择组件（保持默认）：
   ✅ Android Studio
   ✅ Android Virtual Device (可选)
4. 点击 "Next"
```

### 3. 选择安装路径 ⚠️ 关键步骤
```
5. 在 Installation Location 页面：
   
   默认是: C:\Program Files\Android\Android Studio
   
   修改为: D:\Program Files\Android Studio
   
   （点击 Browse，选择或输入 D:\Program Files\Android Studio）

6. 点击 "Next"
7. 点击 "Install"
8. 等待安装完成（约 10 分钟）
9. 点击 "Finish"
```

### 4. 首次启动配置
```
10. 打开 Android Studio
11. 选择 "Do not import settings"
12. 点击 "OK"
13. 选择主题（Darcula 或 Light）
14. 点击 "Next"
15. 安装类型选择 "Standard"
16. 点击 "Next"
17. 点击 "Finish"
18. 等待组件下载（约 10 分钟，取决于网络）
```

---

## 阶段 2: 配置 SDK（10分钟）

### 1. 打开 SDK Manager
```
Android Studio → Tools → SDK Manager
（或点击右上角 SDK Manager 图标）
```

### 2. 安装 SDK Platforms
```
切换到 "SDK Platforms" 标签

勾选以下项目：
☑️ Android 13.0 ("Tiramisu")
   - API Level: 33
   - Revision: 3

☑️ Android 12.0 ("S")
   - API Level: 31
   
点击 "Apply"
点击 "OK"
等待下载完成
```

### 3. 安装 SDK Tools
```
切换到 "SDK Tools" 标签

勾选以下项目：
☑️ Android SDK Build-Tools 33
☑️ Android SDK Command-line Tools (latest)
☑️ Android SDK Platform-Tools
☑️ Android Emulator

点击 "Apply"
点击 "OK"
等待下载完成
```

### 4. 确认 SDK 安装路径
```
在 SDK Manager 顶部，确认 SDK 路径：
SDK Path: D:\ProgramData\Android\Sdk

（如果默认在C盘，建议也改到D盘）
```

---

## 阶段 3: 配置环境变量（5分钟）

### 1. 打开环境变量设置
```
右键 "此电脑" → 属性 → 高级系统设置 → 环境变量
```

### 2. 设置 ANDROID_HOME
```
在 "系统变量" 区域点击 "新建"

变量名：ANDROID_HOME
变量值：D:\ProgramData\Android\Sdk

（注意：如果 SDK 实际路径不同，请按实际情况填写）
点击 "确定"
```

### 3. 编辑 Path 变量
```
在 "系统变量" 区域找到 "Path"，双击编辑

点击 "新建"，添加以下两行：

%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\cmdline-tools\latest\bin

点击 "确定" 保存
```

### 4. 验证配置
```powershell
# 关闭并重新打开 PowerShell 或命令提示符

# 检查 ANDROID_HOME
echo $env:ANDROID_HOME
# 应该显示: D:\ProgramData\Android\Sdk

# 检查 adb
adb --version
# 应该显示版本信息
```

---

## 阶段 4: 本地构建 APK（10分钟）

### 1. 进入项目目录
```powershell
cd D:\BC\WIFI
```

### 2. 运行构建脚本
```powershell
.\scripts\build-android.bat
```

### 3. 构建过程说明
```
构建过程：
1. 安装 npm 依赖（约 2 分钟）
2. 生成签名密钥（首次运行）
3. 下载 Gradle（首次运行，约 5 分钟）
4. 编译 JavaScript Bundle
5. 编译原生代码
6. 打包 APK（约 3 分钟）
```

### 4. 构建完成
```
输出路径：
D:\BC\WIFI\android\app\build\outputs\apk\release\

文件：
- app-universal-release.apk      (通用版，约 50MB)
- app-arm64-v8a-release.apk      (华为 P60 Pro，约 35MB)
- app-armeabi-v7a-release.apk    (旧设备，约 35MB)
```

### 5. 复制到 D:\down
```powershell
# 创建输出目录（如果不存在）
if not exist "D:\down" mkdir D:\down

# 复制 APK 文件
copy "android\app\build\outputs\apk\release\app-universal-release.apk" "D:\down\"
copy "android\app\build\outputs\apk\release\app-arm64-v8a-release.apk" "D:\down\"

# 验证
dir D:\down\*.apk
```

---

## 📋 快速检查清单

### ✅ 安装完成
- [ ] Android Studio 安装在 D:\Program Files\Android Studio
- [ ] 能正常启动 Android Studio
- [ ] SDK 安装在 D 盘（推荐）

### ✅ SDK 配置
- [ ] Android 13.0 (API 33) 已安装
- [ ] Build-Tools 33 已安装
- [ ] Platform-Tools 已安装

### ✅ 环境变量
- [ ] ANDROID_HOME 指向正确路径
- [ ] Path 包含 platform-tools
- [ ] adb 命令可用

### ✅ 构建成功
- [ ] 运行 build-android.bat 无错误
- [ ] 生成 APK 文件
- [ ] APK 已复制到 D:\down

---

## ❗ 常见问题

### Q: 安装程序无法选择 D 盘？
A: 确保 D 盘有足够空间（至少 10GB），手动输入路径 `D:\Program Files\Android Studio`

### Q: SDK 默认安装到 C 盘怎么办？
A: 在 SDK Manager 中点击 "Edit"，将路径修改为 `D:\ProgramData\Android\Sdk`

### Q: 环境变量配置后 adb 仍不可用？
A: 重启 PowerShell 或电脑，确保环境变量生效

### Q: 构建时提示 "Could not find tools.jar"？
A: 确保安装了正确的 Java JDK（推荐 JDK 17）

### Q: Gradle 下载很慢？
A: 修改 `android/build.gradle`，将仓库地址改为国内镜像（阿里云）

---

## 🎯 下一步

请按上述步骤执行，完成后：
1. 检查 D:\down\ 文件夹是否有 APK 文件
2. 在华为 P60 Pro 上安装测试
3. 标记完成状态！

**开始安装吧！** 🚀
