@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - 项目打包工具
echo ==========================================
echo.
echo 此脚本将项目源代码打包为可分发的压缩包
echo.

set VERSION=1.0.0
set PACKAGE_NAME=lenovo-wifi-manager-v%VERSION%

echo [1/4] 清理旧文件...
if exist "%PACKAGE_NAME%.zip" del "%PACKAGE_NAME%.zip"
if exist "temp_package" rmdir /s /q "temp_package"

echo [2/4] 准备打包内容...
mkdir "temp_package\%PACKAGE_NAME%"

:: 复制项目文件
xcopy /e /i /q "src" "temp_package\%PACKAGE_NAME%\src"
xcopy /e /i /q "scripts" "temp_package\%PACKAGE_NAME%\scripts"
xcopy /e /i /q "android" "temp_package\%PACKAGE_NAME%\android"
xcopy /e /i /q "windows" "temp_package\%PACKAGE_NAME%\windows"
xcopy /e /i /q ".github" "temp_package\%PACKAGE_NAME%\.github"

:: 复制根目录文件
copy "package.json" "temp_package\%PACKAGE_NAME%\"
copy "package-lock.json" "temp_package\%PACKAGE_NAME%\"
copy "tsconfig.json" "temp_package\%PACKAGE_NAME%\"
copy "babel.config.js" "temp_package\%PACKAGE_NAME%\"
copy "metro.config.js" "temp_package\%PACKAGE_NAME%\"
copy "react-native.config.js" "temp_package\%PACKAGE_NAME%\"
copy "jest.config.js" "temp_package\%PACKAGE_NAME%\"
copy "jest.setup.js" "temp_package\%PACKAGE_NAME%\"
copy "App.tsx" "temp_package\%PACKAGE_NAME%\"
copy "index.js" "temp_package\%PACKAGE_NAME%\"
copy "app.json" "temp_package\%PACKAGE_NAME%\"
copy ".gitignore" "temp_package\%PACKAGE_NAME%\"
copy "README.md" "temp_package\%PACKAGE_NAME%\"
copy "BUILD_GUIDE.md" "temp_package\%PACKAGE_NAME%\"
copy "QUICK_BUILD.md" "temp_package\%PACKAGE_NAME%\"
copy "BUILD_LOCAL.md" "temp_package\%PACKAGE_NAME%\"
copy "Dockerfile.android" "temp_package\%PACKAGE_NAME%\"
copy "docker-build.bat" "temp_package\%PACKAGE_NAME%\"

echo [3/4] 创建压缩包...
powershell -Command "Compress-Archive -Path 'temp_package\%PACKAGE_NAME%' -DestinationPath '%PACKAGE_NAME%-source.zip' -Force"

echo [4/4] 清理临时文件...
rmdir /s /q "temp_package"

echo.
echo ==========================================
echo 打包完成！
echo ==========================================
echo.
echo 文件名: %PACKAGE_NAME%-source.zip
echo 大小: 
for %%I in ("%PACKAGE_NAME%-source.zip") do echo   %%~zI bytes
echo.
echo 此压缩包包含:
echo   - 完整的项目源代码
echo   - Android 和 Windows 构建配置
echo   - 打包脚本 (build-android.bat, build-windows.bat)
echo   - Docker 构建配置
echo   - GitHub Actions CI/CD 配置
echo.
echo 使用方法:
echo   1. 解压到任意目录
echo   2. 按 BUILD_GUIDE.md 说明配置环境
echo   3. 运行 build-android.bat 或 build-windows.bat
echo.
pause
