@echo off
chcp 65001
echo ==========================================
echo 联想WiFi管理 - Docker 打包 (Android)
echo ==========================================
echo.
echo 此脚本使用 Docker 构建 Android APK，无需本地安装 Android SDK
echo.

:: 检查 Docker
docker -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Docker，请先安装 Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    exit /b 1
)

echo [1/3] 正在构建 Docker 镜像...
docker build -f Dockerfile.android -t lenovo-wifi-builder .

if %ERRORLEVEL% neq 0 (
    echo 错误: Docker 镜像构建失败
    exit /b 1
)

echo [2/3] 正在运行构建容器...
docker run --rm -v "%CD%\output\android:/output" lenovo-wifi-builder

if %ERRORLEVEL% neq 0 (
    echo 错误: 构建失败
    exit /b 1
)

echo [3/3] 复制构建产物...
if not exist "output" mkdir output
if not exist "output\android" mkdir output\android

echo.
echo ==========================================
echo 构建成功！
echo ==========================================
echo.
echo APK 文件已复制到: output\android\
dir output\android\*.apk 2>nul

echo.
pause
