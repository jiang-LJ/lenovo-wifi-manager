# 📦 Android Studio 完整安装与配置指南

## 📥 阶段 1: 下载安装文件

### 目标
- 下载位置: `D:\down\`
- 文件名: `android-studio-2023.x.x-windows.exe` (约 1GB)

### 下载方法（三选一）

#### 方法 A: 浏览器下载（推荐）
1. 访问: https://developer.android.com/studio
2. 点击绿色按钮 **"Download Android Studio"**
3. 勾选同意协议
4. 点击下载
5. **保存到 `D:\down\` 文件夹**

#### 方法 B: PowerShell 下载
```powershell
# 创建目录
mkdir D:\down -Force

# 下载（可能需要几分钟）
Invoke-WebRequest `
  -Uri "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.28/android-studio-2023.1.1.28-windows.exe" `
  -OutFile "D:\down\android-studio.exe"
```

#### 方法 C: 使用脚本
```bash
双击运行: DOWNLOAD_AND_INSTALL_ANDROID_STUDIO.bat
```

---

## 🔧 阶段 2: 安装到 D 盘

### 步骤

1. **运行安装程序**
   ```
   双击: D:\down\android-studio-xxx.exe
   ```

2. **安装向导**
   ```
   Welcome → 点击 [Next]
   ```

3. **选择组件**
   ```
   ☑️ Android Studio (必须)
   ☑️ Android Virtual Device (可选，模拟器)
   
   点击 [Next]
   ```

4. **⚠️ 关键步骤: 选择安装路径**
   ```
   默认路径: C:\Program Files\Android\Android Studio
   
   修改为:   D:\Program Files\Android Studio
   
   操作:
   1. 点击 [Browse...]
   2. 选择 D 盘
   3. 新建文件夹: Program Files\Android Studio
   4. 点击 [确定]
   5. 点击 [Next]
   ```

5. **开始安装**
   ```
   点击 [Install]
   
   等待安装完成（进度条到 100%）
   约 10 分钟
   ```

6. **完成安装**
   ```
   点击 [Finish]
   
   ✅ 勾选 "Start Android Studio"
   ```

---

## ⚙️ 阶段 3: 首次启动配置

### 步骤

1. **导入设置**
   ```
   选择: Do not import settings
   点击: [OK]
   ```

2. **数据共享**
   ```
   选择: Don't send
   点击: [Next]
   ```

3. **欢迎界面**
   ```
   选择安装类型: Standard
   点击: [Next]
   ```

4. **选择主题**
   ```
   Darcula (深色) 或 Light (浅色)
   点击: [Next]
   ```

5. **验证设置**
   ```
   确认 SDK 组件列表
   点击: [Next]
   ```

6. **下载组件**
   ```
   点击: [Finish]
   
   等待下载完成（约 10-15 分钟）
   取决于网络速度
   ```

7. **完成**
   ```
   看到 "Welcome to Android Studio" 界面
   ✅ 首次启动完成
   ```

---

## 📦 阶段 4: 安装 SDK 组件

### 打开 SDK Manager
```
Android Studio → Tools → SDK Manager
（或点击右上角 SDK Manager 图标）
```

### 安装 SDK Platforms

1. 切换到 **"SDK Platforms"** 标签

2. 勾选以下内容：
   ```
   ☑️ Android 13.0 ("Tiramisu")
      - API Level: 33
      
   ☑️ Android 12.0 ("S")
      - API Level: 31
   ```

3. 点击 **"Apply"**
4. 点击 **"OK"**
5. 等待下载完成

### 安装 SDK Tools

1. 切换到 **"SDK Tools"** 标签

2. 勾选以下内容：
   ```
   ☑️ Android SDK Build-Tools 33
   ☑️ Android SDK Command-line Tools (latest)
   ☑️ Android SDK Platform-Tools
   ☑️ Android Emulator
   ☑️ Intel x86 Emulator Accelerator (HAXM installer)
   ```

3. 点击 **"Apply"**
4. 点击 **"OK"**
5. 等待下载完成

### 确认 SDK 路径（重要）

```
SDK Manager 顶部显示：
Android SDK Location: D:\ProgramData\Android\Sdk

如果显示 C 盘，建议点击 "Edit" 改为 D 盘
```

---

## 🔧 阶段 5: 配置环境变量

### 步骤

1. **打开系统属性**
   ```
   右键 "此电脑" → 属性
   → 高级系统设置
   → 环境变量
   ```

2. **新建 ANDROID_HOME**
   ```
   在 "系统变量" 区域，点击 [新建]
   
   变量名: ANDROID_HOME
   变量值: D:\ProgramData\Android\Sdk
   
   点击 [确定]
   ```

3. **编辑 Path 变量**
   ```
   在 "系统变量" 区域，找到 "Path"
   双击编辑
   
   点击 [新建]，添加以下两行：
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\cmdline-tools\latest\bin
   
   点击 [确定]
   ```

4. **验证配置**
   ```powershell
   # 关闭并重新打开 PowerShell
   
   # 检查 ANDROID_HOME
   echo $env:ANDROID_HOME
   # 应显示: D:\ProgramData\Android\Sdk
   
   # 检查 adb
   adb --version
   # 应显示: Android Debug Bridge version x.x.x
   ```

---

## 🏗️ 阶段 6: 构建 APK

### 步骤

1. **打开 PowerShell**
   ```powershell
   # 进入项目目录
   cd D:\BC\WIFI
   ```

2. **运行构建脚本**
   ```powershell
   .\scripts\build-android.bat
   ```

3. **构建过程**
   ```
   [1/4] 安装依赖...         (约 2 分钟)
   [2/4] 生成签名密钥...      (首次运行)
   [3/4] 下载 Gradle...       (首次运行，约 5 分钟)
   [4/4] 构建 APK...          (约 3 分钟)
   ```

4. **复制 APK**
   ```powershell
   # 创建输出目录
   mkdir D:\down -Force
   
   # 复制 APK 文件
   copy "android\app\build\outputs\apk\release\app-universal-release.apk" "D:\down\"
   copy "android\app\build\outputs\apk\release\app-arm64-v8a-release.apk" "D:\down\"
   
   # 验证
   dir D:\down\*.apk
   ```

---

## ✅ 完成检查清单

### 下载安装
- [ ] 安装包已下载到 `D:\down\`
- [ ] Android Studio 安装在 `D:\Program Files\Android Studio`
- [ ] 能正常启动 Android Studio

### SDK 配置
- [ ] Android 13.0 (API 33) 已安装
- [ ] Build-Tools 33 已安装
- [ ] Platform-Tools 已安装
- [ ] SDK 路径在 D 盘（推荐）

### 环境变量
- [ ] ANDROID_HOME = `D:\ProgramData\Android\Sdk`
- [ ] Path 包含 platform-tools
- [ ] adb 命令可用

### 构建成功
- [ ] 运行 build-android.bat 无错误
- [ ] 生成 APK 文件
- [ ] APK 已复制到 `D:\down\`

---

## 🎯 预期结果

完成所有步骤后，`D:\down\` 文件夹应有：

```
D:\down\
├── android-studio-xxx.exe          (安装包)
├── app-universal-release.apk       (通用版 APK)
├── app-arm64-v8a-release.apk       (华为 P60 Pro 专用)
└── ...
```

---

## ❗ 常见问题

### Q: 下载速度慢？
A: 
- 使用手机热点下载
- 或从国内镜像下载：https://www.androiddevtools.cn/

### Q: 安装程序无法选择 D 盘？
A:
- 确保 D 盘有足够空间（至少 10GB）
- 手动输入完整路径：`D:\Program Files\Android Studio`

### Q: SDK 默认安装在 C 盘？
A:
- 在 SDK Manager 中点击 "Edit"
- 修改为 `D:\ProgramData\Android\Sdk`

### Q: 构建时提示 "JAVA_HOME" 错误？
A:
- 确保安装了 Java JDK（推荐 JDK 17）
- 设置 JAVA_HOME 环境变量

### Q: Gradle 下载很慢？
A:
- 修改 `android/build.gradle`，使用阿里云镜像
- 或使用手机热点

---

## 🚀 开始执行

**现在请执行：**

1. 打开浏览器，访问 https://developer.android.com/studio
2. 下载安装包，保存到 `D:\down\`
3. 运行安装程序，安装到 `D:\Program Files\Android Studio`
4. 按上述步骤配置 SDK 和环境变量
5. 运行构建脚本生成 APK

**或者直接双击运行：** `DOWNLOAD_AND_INSTALL_ANDROID_STUDIO.bat`

---

**有任何问题随时告诉我！** 🎉
