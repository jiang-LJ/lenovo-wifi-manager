@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - Android APK 构建工具
echo ==========================================
echo.

:: 检查 Node.js
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Node.js，请确保已安装 Node.js 18+
    exit /b 1
)

:: 检查 Java
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Java，请确保已安装 JDK 11+
    exit /b 1
)

echo 环境检查通过
echo.

:: 安装依赖
echo [1/4] 正在安装依赖...
call npm install
if %ERRORLEVEL% neq 0 (
    echo 错误: 依赖安装失败
    exit /b 1
)

:: 清理旧构建
echo [2/4] 正在清理旧构建...
cd android
if exist "app\build" rmdir /s /q "app\build"
if exist "build" rmdir /s /q "build"

:: 生成签名密钥（如果不存在）
if not exist "app\release.keystore" (
    echo [3/4] 正在生成签名密钥...
    keytool -genkeypair -v -storetype PKCS12 -keystore "app\release.keystore" -alias lenovo-wifi-manager -keyalg RSA -keysize 2048 -validity 10000 -storepass lenovo2024 -keypass lenovo2024 -dname "CN=Lenovo WiFi Manager, OU=Lenovo, O=Lenovo, L=Beijing, ST=Beijing, C=CN"
) else (
    echo [3/4] 签名密钥已存在，跳过生成
)

:: 构建 Release APK
echo [4/4] 正在构建 Release APK...
if exist "gradlew.bat" (
    call gradlew.bat clean assembleRelease
) else (
    call gradlew clean assembleRelease
)

if %ERRORLEVEL% neq 0 (
    echo 错误: APK 构建失败
    cd ..
    exit /b 1
)

cd ..

echo.
echo ==========================================
echo 构建成功！
echo ==========================================
echo.
echo APK 输出路径:
echo   - 通用版 (推荐): android\app\build\outputs\apk\release\app-universal-release.apk
echo   - ARM64 (P60 Pro): android\app\build\outputs\apk\release\app-arm64-v8a-release.apk
echo   - ARMv7: android\app\build\outputs\apk\release\app-armeabi-v7a-release.apk
echo.
echo 安装命令:
echo   adb install android\app\build\outputs\apk\release\app-universal-release.apk
echo.
pause
