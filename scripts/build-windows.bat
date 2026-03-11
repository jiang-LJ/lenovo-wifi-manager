@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - Windows 构建工具
echo ==========================================
echo.

:: 检查 Node.js
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Node.js
    exit /b 1
)

:: 检查 MSBuild
where msbuild >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 警告: 未找到 MSBuild，请确保已安装 Visual Studio 2022 和 C++ 桌面开发工作负载
    echo 尝试使用 npx react-native...
)

echo 环境检查完成
echo.

:: 安装依赖
echo [1/3] 正在安装依赖...
call npm install
if %ERRORLEVEL% neq 0 (
    echo 错误: 依赖安装失败
    exit /b 1
)

:: 构建 JavaScript Bundle
echo [2/3] 正在构建 JavaScript Bundle...
npx react-native bundle --platform windows --dev false --entry-file index.js --bundle-output windows/LenovoWiFiManager/Bundle/index.windows.bundle --assets-dest windows/LenovoWiFiManager/Bundle

if %ERRORLEVEL% neq 0 (
    echo 错误: Bundle 构建失败
    exit /b 1
)

:: 构建 Windows 项目
echo [3/3] 正在构建 Windows 应用...
cd windows

:: 尝试使用 MSBuild
msbuild LenovoWiFiManager.sln /p:Configuration=Release /p:Platform=x64 /p:AppxBundle=Always /p:AppxBundlePlatforms="x64"

if %ERRORLEVEL% neq 0 (
    echo 警告: MSBuild 失败，尝试使用 react-native run-windows...
    cd ..
    npx react-native run-windows --arch x64 --release --deploy-from-layout
    if %ERRORLEVEL% neq 0 (
        echo 错误: Windows 构建失败
        exit /b 1
    )
) else (
    cd ..
)

echo.
echo ==========================================
echo 构建成功！
echo ==========================================
echo.
echo 输出路径:
echo   - AppX 包: windows\LenovoWiFiManager\AppPackages\
echo   - 可执行文件: windows\LenovoWiFiManager\Release\
echo.
echo 安装方法:
echo   方法1: 双击 appx/appxbundle 文件安装
echo   方法2: 使用 PowerShell: Add-AppxPackage -Path *.appx
echo.
pause
