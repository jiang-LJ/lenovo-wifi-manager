@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - 方案2: Android Studio
echo ==========================================
echo.
echo 安装路径: D:\Program Files\Android Studio
echo.

:: 检查是否已安装
if exist "D:\Program Files\Android Studio\bin\studio64.exe" (
    echo ✅ 检测到 Android Studio 已安装
    echo.
    goto CHECK_SDK
) else (
    echo ⬜ Android Studio 未安装
    echo.
    goto INSTALL_GUIDE
)

:INSTALL_GUIDE
echo ==========================================
echo 阶段 1: 下载安装 Android Studio
echo ==========================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 访问下载页面：
echo    https://developer.android.com/studio
echo.
echo 2. 点击 "Download Android Studio"
echo.
echo 3. 运行安装程序，在 Installation Location 页面：
echo    修改为: D:\Program Files\Android Studio
echo.
echo 4. 完成安装并启动 Android Studio
    echo.
    
    set /p INSTALLED=是否已完成安装并启动？(Y/N): 
    if /I not "%INSTALLED%"=="Y" (
        echo 请先完成安装，然后重新运行此脚本
        pause
        exit /b 0
    )

:CHECK_SDK
echo.
echo ==========================================
echo 阶段 2: 配置 SDK
echo ==========================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 在 Android Studio 中，点击 Tools → SDK Manager
echo.
echo 2. 在 SDK Platforms 标签页，勾选：
echo    ☑️ Android 13.0 ("Tiramisu") API 33
echo.
echo 3. 在 SDK Tools 标签页，勾选：
echo    ☑️ Android SDK Build-Tools 33
echo    ☑️ Android SDK Command-line Tools
echo    ☑️ Android SDK Platform-Tools
echo.
echo 4. 点击 Apply → OK，等待下载完成
echo.
echo 5. 确认 SDK 路径（建议改为 D 盘）：
echo    D:\ProgramData\Android\Sdk
echo.

set /p SDK_DONE=是否已完成 SDK 配置？(Y/N): 
if /I not "%SDK_DONE%"=="Y" (
    echo 请先完成 SDK 配置
    pause
    exit /b 0
)

:CONFIG_ENV
echo.
echo ==========================================
echo 阶段 3: 配置环境变量
echo ==========================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 右键 "此电脑" → 属性 → 高级系统设置 → 环境变量
echo.
echo 2. 在 "系统变量" 中点击 "新建"
echo    变量名: ANDROID_HOME
echo    变量值: D:\ProgramData\Android\Sdk
echo.
echo 3. 编辑 "Path" 变量，添加：
echo    %%ANDROID_HOME%%\platform-tools
    echo.
    
    set /p ENV_DONE=是否已完成环境变量配置？(Y/N): 
    if /I not "%ENV_DONE%"=="Y" (
        echo 请先完成环境变量配置
        pause
        exit /b 0
    )

:BUILD_APK
echo.
echo ==========================================
echo 阶段 4: 构建 APK
echo ==========================================
echo.
echo 即将运行构建脚本...
echo.
pause

cd /d D:\BC\WIFI
call scripts\build-android.bat

echo.
echo ==========================================
echo 构建完成检查
echo ==========================================
echo.

if exist "android\app\build\outputs\apk\release\app-arm64-v8a-release.apk" (
    echo ✅ 构建成功！
    echo.
    echo 正在复制 APK 到 D:\down...
    if not exist "D:\down" mkdir D:\down
    copy "android\app\build\outputs\apk\release\app-universal-release.apk" "D:\down\" >nul
    copy "android\app\build\outputs\apk\release\app-arm64-v8a-release.apk" "D:\down\" >nul
    echo.
    echo D:\down 文件夹内容：
    dir D:\down\*.apk /b
    echo.
    echo 🎉 方案2完成！
    echo.
    echo 您现在可以：
    echo   1. 将 APK 安装到华为 P60 Pro
    echo   2. 开始管理您的 WiFi 设备
) else (
    echo ❌ 构建失败，请检查上面的错误信息
    echo.
    echo 常见问题：
    echo   - 检查 ANDROID_HOME 环境变量
    echo   - 确保 SDK 组件已正确安装
    echo   - 检查网络连接（Gradle下载需要网络）
)

echo.
pause
