@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - 方案1: EAS Build 启动器
echo ==========================================
echo.
echo 此脚本将引导您完成云端构建
echo.

:: 检查 Node.js
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node -v
echo.

:: 安装 EAS CLI
echo [1/5] 正在安装/检查 EAS CLI...
npm install -g eas-cli
if %ERRORLEVEL% neq 0 (
    echo 警告: EAS CLI 安装可能失败，请检查网络连接
    pause
)

echo ✅ EAS CLI 已就绪
echo.

:: 检查登录状态
echo [2/5] 检查登录状态...
eas whoami >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo 您尚未登录 Expo，请先注册账号：
    echo   1. 访问 https://expo.dev/signup
    echo   2. 注册完成后，按任意键继续登录
    pause
    echo.
    echo [3/5] 正在登录...
    eas login
) else (
    echo ✅ 已登录 Expo
    eas whoami
)

echo.

:: 进入项目目录
echo [4/5] 进入项目目录...
cd /d D:\BC\WIFI
echo 当前目录: %CD%
echo.

:: 初始化项目
echo [5/5] 初始化 EAS 项目...
if not exist "eas.json" (
    echo 首次使用，需要初始化...
    eas init
) else (
    echo ✅ 项目已初始化
)

echo.
echo ==========================================
echo 准备就绪！开始构建？
echo ==========================================
echo.
echo 即将执行: eas build -p android --profile preview
echo.
echo 此命令将：
echo   1. 上传代码到 Expo 云端
echo   2. 在云端构建 Android APK
echo   3. 构建时间约 10-15 分钟
echo   4. 完成后提供下载链接
echo.

set /p START_BUILD=是否现在开始构建？(Y/N): 

if /I "%START_BUILD%"=="Y" (
    echo.
    echo 🚀 开始构建...
    echo 请不要关闭此窗口，等待构建完成
    echo.
    eas build -p android --profile preview
    
    echo.
    echo ==========================================
    echo 构建命令已执行！
    echo ==========================================
    echo.
    echo 如果构建成功，请按提示下载 APK 到 D:\down 文件夹
    echo.
    echo 方案1完成后，请运行: START_STEP2.bat
    echo.
) else (
    echo.
    echo 已取消构建
    echo 您可以稍后手动运行: eas build -p android --profile preview
)

pause
