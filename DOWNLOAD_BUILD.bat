@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - 构建产物下载助手
echo ==========================================
echo.
echo 此脚本帮助您从 GitHub Actions 下载构建产物
echo.

set /p GITHUB_USER=请输入您的 GitHub 用户名: 
set /p REPO_NAME=请输入仓库名称（默认 lenovo-wifi-manager）: 
if "%REPO_NAME%"=="" set REPO_NAME=lenovo-wifi-manager

echo.
echo 创建下载目录...
if not exist "D:\down" mkdir D:\down

echo.
echo 请在浏览器中完成以下操作：
echo.
echo   1. 访问: https://github.com/%GITHUB_USER%/%REPO_NAME%/releases
    echo   2. 找到最新发布的版本（v1.0.0）
    echo   3. 下载以下文件到 D:\down 文件夹：
    echo      ├─ 联想WiFi管理-安卓通用版-v1.0.0.apk
    echo      ├─ 联想WiFi管理-华为P60Pro版-v1.0.0.apk
    echo      └─ 联想WiFi管理-Windows版-v1.0.0.msix
    echo.
    
    set /p OPEN_BROWSER=是否现在打开浏览器？(Y/N): 
    if /I "%OPEN_BROWSER%"=="Y" (
        start https://github.com/%GITHUB_USER%/%REPO_NAME%/releases
    )
    
    echo.
    echo ==========================================
    echo 下载完成后，文件将位于：
    echo   D:\down\
    echo ==========================================
    echo.
    echo 安装说明：
    echo   Android (华为 P60 Pro):
    echo     1. 将 APK 传输到手机
    echo     2. 点击安装（允许未知来源应用）
    echo.
    echo   Windows 11:
    echo     1. 双击 .msix 文件安装
    echo     2. 或使用: Add-AppxPackage -Path "*.msix"
    echo.
    
    pause
