@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - 快速打包全部平台
echo ==========================================
echo.
echo 请选择打包方式:
echo.
echo [1] Android APK (需要 Android SDK)
echo [2] Windows MSIX (需要 Visual Studio)
echo [3] Windows 便携版 (需要 Node.js 环境)
echo [4] Android APK (使用 Docker - 推荐)
echo [5] 全部打包 (Docker 方案)
echo [0] 退出
echo.

set /p choice=请输入选项 (0-5): 

if "%choice%"=="1" goto android
if "%choice%"=="2" goto windows
if "%choice%"=="3" goto portable
if "%choice%"=="4" goto docker
if "%choice%"=="5" goto all
if "%choice%"=="0" exit /b 0

echo 无效选项
goto end

:android
call "%~dp0build-android.bat"
goto end

:windows
call "%~dp0build-windows.bat"
goto end

:portable
call "%~dp0build-portable.bat"
goto end

:docker
echo.
echo 正在检查 Docker...
docker -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Docker，请先安装 Docker Desktop
    pause
    exit /b 1
)
echo Docker 已安装，开始构建...
cd "%~dp0.."
docker build -f Dockerfile.android -t lenovo-wifi-builder .
docker run --rm -v "%CD%\output\android:/output" lenovo-wifi-builder
echo.
echo APK 已生成到: output\android\
dir output\android\*.apk 2>nul
pause
goto end

:all
echo.
echo === 开始打包 Android (Docker) ===
cd "%~dp0.."
docker build -f Dockerfile.android -t lenovo-wifi-builder .
docker run --rm -v "%CD%\output\android:/output" lenovo-wifi-builder
echo.
echo === Android 打包完成 ===
echo.
dir output\android\*.apk 2>nul
echo.
pause
goto end

:end
