@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - 方案2: Android Studio
echo ==========================================
echo.

:: 检查方案1是否完成
if not exist "D:\down" (
    mkdir D:\down
)

set APK_COUNT=0
for %%F in (D:\down\*.apk) do set /a APK_COUNT+=1

if %APK_COUNT%==0 (
    echo ⚠️ 警告: 未在 D:\down 文件夹发现 APK 文件
    echo.
    echo 建议先完成方案1（EAS Build），再执行方案2
    echo.
    set /p CONTINUE=是否仍要继续安装 Android Studio？(Y/N): 
    if /I not "%CONTINUE%"=="Y" (
        echo 已取消，请先完成方案1
        pause
        exit /b 0
    )
) else (
    echo ✅ 检测到 %APK_COUNT% 个 APK 文件（方案1已完成）
    echo.
)

echo 此脚本将引导您安装 Android Studio
echo.
echo ==========================================
echo 步骤概览
echo ==========================================
echo.
echo 阶段1: 下载安装 Android Studio (15分钟)
echo   → 访问官网下载
echo   → 运行安装程序
echo   → 完成首次配置
echo.
echo 阶段2: 安装 SDK 组件 (10分钟)
echo   → 打开 SDK Manager
echo   → 安装 Android 13.0
echo   → 安装 Build-Tools
echo.
echo 阶段3: 配置环境变量 (5分钟)
echo   → 设置 ANDROID_HOME
echo   → 配置 Path 变量
echo.
echo 阶段4: 本地构建 APK (10分钟)
echo   → 运行 build-android.bat
echo   → 等待 Gradle 下载
echo   → 生成 APK 文件
echo.

echo ==========================================
echo 开始阶段1: 下载安装
echo ==========================================
echo.
echo 请按以下步骤操作：
echo.
echo 1. 访问下载页面:
echo    https://developer.android.com/studio
echo.
echo 2. 点击 "Download Android Studio"
echo.
echo 3. 下载完成后运行安装程序
echo.
echo 4. 安装选项:
echo    → Next → Next → Install
    echo    → 等待安装完成
    echo    → Finish
    echo.
    
    set /p INSTALLED=是否已完成 Android Studio 安装？(Y/N): 
    
    if /I "%INSTALLED%"=="Y" (
        echo.
        echo ✅ 阶段1完成
        echo.
        echo ==========================================
        echo 开始阶段2: 配置 SDK
        echo ==========================================
        echo.
        echo 请按以下步骤操作：
        echo.
        echo 1. 打开 Android Studio
        echo 2. 点击 Tools → SDK Manager
        echo 3. 在 SDK Platforms 标签页：
        echo    勾选: Android 13.0 ("Tiramisu") API 33
        echo 4. 在 SDK Tools 标签页：
        echo    勾选: Android SDK Build-Tools 33
        echo    勾选: Android SDK Command-line Tools
        echo    勾选: Android SDK Platform-Tools
        echo 5. 点击 Apply → OK
        echo 6. 等待下载完成
        echo.
        
        set /p SDK_DONE=是否已完成 SDK 配置？(Y/N): 
        
        if /I "%SDK_DONE%"=="Y" (
            echo.
            echo ✅ 阶段2完成
            echo.
            echo ==========================================
            echo 开始阶段3: 环境变量
            echo ==========================================
            echo.
            echo 请按以下步骤操作：
            echo.
            echo 1. 右键 "此电脑" → 属性 → 高级系统设置
            echo 2. 点击 "环境变量"
            echo 3. 在 "系统变量" 中点击 "新建"
            echo 4. 输入：
            echo    变量名: ANDROID_HOME
            echo    变量值: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
            echo 5. 找到 "Path" 变量，点击编辑
            echo 6. 添加两行：
            echo    %%ANDROID_HOME%%\platform-tools
            echo    %%ANDROID_HOME%%\cmdline-tools\latest\bin
            echo 7. 点击确定保存
            echo.
            echo 注意: 需要将上面的 %USERNAME% 替换为您的实际用户名
            echo.
            
            set /p ENV_DONE=是否已完成环境变量配置？(Y/N): 
            
            if /I "%ENV_DONE%"=="Y" (
                echo.
                echo ✅ 阶段3完成
                echo.
                echo ==========================================
                echo 开始阶段4: 本地构建
                echo ==========================================
                echo.
                echo 即将运行: scripts\build-android.bat
                echo.
                pause
                
                cd /d D:\BC\WIFI
                call scripts\build-android.bat
                
                echo.
                echo ==========================================
                echo 构建完成！
                echo ==========================================
                echo.
                echo 检查输出文件...
                echo.
                
                if exist "android\app\build\outputs\apk\release\app-arm64-v8a-release.apk" (
                    echo ✅ 构建成功！
                    echo.
                    echo 正在复制 APK 到 D:\down...
                    copy "android\app\build\outputs\apk\release\*.apk" D:\down\
                    echo.
                    echo 方案2完成！
                    echo.
                    echo D:\down 文件夹内容：
                    dir D:\down\*.apk /b
                ) else (
                    echo ❌ 未找到 APK 文件，构建可能失败
                    echo 请检查上面的错误信息
                )
            )
        )
    )
)

echo.
pause
