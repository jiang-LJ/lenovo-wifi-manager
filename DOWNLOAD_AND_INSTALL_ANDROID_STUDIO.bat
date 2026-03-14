@echo off
chcp 65001
cls

echo ==========================================
echo Android Studio 下载与安装助手
echo ==========================================
echo.
echo 下载目标: D:\down\
echo 安装目标: D:\Program Files\Android Studio

echo.

:: 创建下载目录
if not exist "D:\down" mkdir D:\down

echo [1/5] 准备下载...
echo.
echo 注意: Android Studio 安装包约 1GB，下载需要几分钟
    echo.
    
    :: 检查是否存在已下载的文件
    if exist "D:\down\android-studio-*.exe" (
        echo ✅ 检测到已下载的安装包:
        dir "D:\down\android-studio-*.exe" /b
        echo.
        set /p USE_EXISTING=是否使用已存在的文件？(Y/N): 
        if /I "%USE_EXISTING%"=="Y" (
            goto INSTALL_STEP
        )
    )
    
    :DOWNLOAD_STEP
    echo [2/5] 下载 Android Studio...
    echo.
    echo 由于 Windows 没有内置 wget/curl，请使用以下方式下载：
    echo.
    echo 方式1 - 浏览器下载（推荐）:
    echo   1. 访问: https://developer.android.com/studio
    echo   2. 点击 "Download Android Studio"
    echo   3. 保存到: D:\down\
    echo.
    echo 方式2 - PowerShell 下载:
    echo   打开 PowerShell，执行:
    echo   Invoke-WebRequest -Uri "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.28/android-studio-2023.1.1.28-windows.exe" -OutFile "D:\down\android-studio.exe"
    echo.
    
    set /p DOWNLOADED=是否已完成下载到 D:\down\？(Y/N): 
    if /I not "%DOWNLOADED%"=="Y" (
        echo.
        echo 是否现在打开浏览器下载？(Y/N)
        set /p OPEN_BROWSER=
        if /I "%OPEN_BROWSER%"=="Y" (
            start https://developer.android.com/studio
        )
        echo.
        echo 请下载完成后重新运行此脚本
        pause
        exit /b 0
    )

:INSTALL_STEP
echo.
echo [3/5] 准备安装...
echo.

:: 查找安装包
for %%F in ("D:\down\android-studio*.exe") do set INSTALLER=%%F

if not defined INSTALLER (
    echo ❌ 未在 D:\down\ 找到安装包
    echo 请确保已下载 android-studio-xxx.exe
    pause
    exit /b 1
)

echo ✅ 找到安装包: %INSTALLER%
echo.

:: 检查目标目录
if exist "D:\Program Files\Android Studio" (
    echo ⚠️ 警告: D:\Program Files\Android Studio 已存在
    set /p OVERWRITE=是否重新安装？(Y/N): 
    if /I not "%OVERWRITE%"=="Y" (
        echo 跳过安装
        goto POST_INSTALL
    )
)

echo [4/5] 开始安装...
echo.
echo 安装程序即将启动，请按以下步骤操作：
echo.
echo 1. 点击 "Next"
echo 2. 选择组件（保持默认）
echo 3. ⚠️ 关键步骤 - 修改安装路径：
echo    将默认路径改为: D:\Program Files\Android Studio
echo 4. 点击 "Install"
echo 5. 等待安装完成
    echo 6. 点击 "Finish"
    echo.
    
    echo 点击任意键启动安装程序...
    pause
    
    :: 启动安装程序
    start "" "%INSTALLER%"
    
    echo.
    echo 安装程序已启动，请在安装程序中完成安装
    echo.
    echo ⚠️ 重要提醒：
    echo   安装路径务必选择: D:\Program Files\Android Studio
    echo.
    
    set /p INSTALL_DONE=是否已完成安装？(Y/N): 
    if /I not "%INSTALL_DONE%"=="Y" (
        echo 请先完成安装
        pause
        exit /b 0
    )

:POST_INSTALL
echo.
echo [5/5] 安装完成检查...
echo.

if exist "D:\Program Files\Android Studio\bin\studio64.exe" (
    echo ✅ Android Studio 安装成功！
    echo.
    echo 安装位置: D:\Program Files\Android Studio
    echo 启动程序: D:\Program Files\Android Studio\bin\studio64.exe
    echo.
    echo 下一步：
    echo   1. 首次启动 Android Studio
    echo   2. 配置 SDK（Tools → SDK Manager）
    echo   3. 设置环境变量
    echo   4. 运行 build-android.bat
    echo.
    
    set /p LAUNCH_NOW=是否现在启动 Android Studio？(Y/N): 
    if /I "%LAUNCH_NOW%"=="Y" (
        start "" "D:\Program Files\Android Studio\bin\studio64.exe"
    )
) else (
    echo ⚠️ 未检测到安装文件
    echo 可能安装路径不同，请检查
)

echo.
pause
