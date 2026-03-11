@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - Android签名密钥生成工具
echo ==========================================
echo.

set KEYSTORE_FILE=android\app\release.keystore
set KEY_ALIAS=lenovo-wifi-manager
set KEY_PASSWORD=lenovo2024
set VALIDITY=10000

echo 正在生成签名密钥...
echo 密钥文件: %KEYSTORE_FILE%
echo 密钥别名: %KEY_ALIAS%
echo 有效期: %VALIDITY% 天
echo.

if exist %KEYSTORE_FILE% (
    echo 警告: 密钥文件已存在，是否覆盖？(Y/N)
    set /p OVERWRITE=
    if /I not "%OVERWRITE%"=="Y" (
        echo 操作已取消
        exit /b 1
    )
)

keytool -genkeypair -v -storetype PKCS12 -keystore %KEYSTORE_FILE% -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity %VALIDITY% -storepass %KEY_PASSWORD% -keypass %KEY_PASSWORD% -dname "CN=Lenovo WiFi Manager, OU=Lenovo, O=Lenovo, L=Beijing, ST=Beijing, C=CN"

if %ERRORLEVEL% neq 0 (
    echo 错误: 密钥生成失败
    exit /b 1
)

echo.
echo ==========================================
echo 密钥生成成功！
echo ==========================================
echo 文件路径: %KEYSTORE_FILE%
echo 密钥别名: %KEY_ALIAS%
echo 存储密码: %KEY_PASSWORD%
echo.
echo 警告: 请妥善保管此密钥文件，丢失后将无法更新应用！
pause
