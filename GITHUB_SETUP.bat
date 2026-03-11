@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - GitHub 云端打包助手
echo ==========================================
echo.
echo 此脚本将指导您完成 GitHub Actions 云端打包
echo.

:: 检查 Git
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Git，请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] 检查 Git 配置...
git config user.name >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 配置 Git 用户信息...
    git config user.email "builder@lenovo.com"
    git config user.name "Lenovo Builder"
)
echo 完成
echo.

echo [2/5] 检查提交状态...
git status --porcelain | findstr /r "^" >nul
if %ERRORLEVEL% equ 0 (
    echo 发现未提交的更改，正在提交...
    git add -A
    git commit -m "Update for build"
) else (
    echo 所有更改已提交
)
echo.

echo [3/5] 配置 GitHub 仓库...
echo.
echo 请确保您已完成以下步骤：
echo   1. 在 GitHub 创建仓库：https://github.com/new
    echo   2. 仓库名称建议：lenovo-wifi-manager
    echo   3. 保持默认设置（Public），点击 Create repository
    echo.
    set /p GITHUB_USER=请输入您的 GitHub 用户名: 
    set /p REPO_NAME=请输入仓库名称（默认 lenovo-wifi-manager）: 
    if "!REPO_NAME!"=="" set REPO_NAME=lenovo-wifi-manager
    
    echo.
    echo 正在添加远程仓库...
    git remote remove origin 2>nul
    git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
    echo.
    
    echo [4/5] 推送代码到 GitHub...
    echo.
    echo 正在推送到 GitHub（这可能需要几分钟）...
    git push -u origin master 2>nul || git push -u origin main 2>nul
    
    if %ERRORLEVEL% neq 0 (
        echo.
        echo 推送到 GitHub 失败。请手动执行以下命令：
        echo.
        echo   git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
        echo   git push -u origin master
        echo.
        echo 如果提示输入凭据，请使用 Personal Access Token
        pause
        exit /b 1
    )
    
    echo.
    echo [5/5] 创建标签触发构建...
    echo.
    git tag v1.0.0
    git push origin v1.0.0
    
    echo.
    echo ==========================================
    echo 成功！云端打包已触发
    echo ==========================================
    echo.
    echo 构建状态查看地址：
    echo   https://github.com/%GITHUB_USER%/%REPO_NAME%/actions
    echo.
    echo 请按以下步骤操作：
    echo   1. 点击上方链接打开 Actions 页面
    echo   2. 等待构建完成（约 10-15 分钟）
    echo   3. 完成后访问：
    echo      https://github.com/%GITHUB_USER%/%REPO_NAME%/releases
    echo   4. 下载以下文件到 D:\down 文件夹：
    echo      - 联想WiFi管理-安卓通用版-v1.0.0.apk
    echo      - 联想WiFi管理-华为P60Pro版-v1.0.0.apk
    echo      - 联想WiFi管理-Windows版-v1.0.0.msix
    echo.
    
    set /p OPEN_BROWSER=是否现在打开浏览器查看？(Y/N): 
    if /I "%OPEN_BROWSER%"=="Y" (
        start https://github.com/%GITHUB_USER%/%REPO_NAME%/actions
    )
    
    echo.
    pause
