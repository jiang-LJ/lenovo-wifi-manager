@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - GitHub 构建下载助手
echo ==========================================
echo.

set GITHUB_USER=jiang-LJ
set REPO_NAME=lenovo-wifi-manager
set VERSION=v1.0.0

echo 正在创建下载目录...
if not exist "D:\down" mkdir D:\down

echo.
echo 请访问以下链接下载构建产物：
echo.
echo   https://github.com/%GITHUB_USER%/%REPO_NAME%/releases/tag/%VERSION%
echo.
echo 请下载以下文件到 D:\down 文件夹：
echo   ├─ 联想WiFi管理-安卓通用版-%VERSION%.apk
echo   ├─ 联想WiFi管理-华为P60Pro版-%VERSION%.apk
echo   └─ 联想WiFi管理-Windows版-%VERSION%.msix
echo.

set /p OPEN_BROWSER=是否现在打开浏览器？(Y/N): 
if /I "%OPEN_BROWSER%"=="Y" (
    start https://github.com/%GITHUB_USER%/%REPO_NAME%/releases/tag/%VERSION%
)

echo.
echo ==========================================
echo 等待构建完成...
echo ==========================================
echo.
echo 如果页面显示 "Not Found"，说明构建尚未完成。
echo 请稍后刷新页面，或访问 Actions 页面查看进度：
echo   https://github.com/%GITHUB_USER%/%REPO_NAME%/actions
echo.
pause
