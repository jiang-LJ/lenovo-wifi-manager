#!/bin/bash

echo "=========================================="
echo "联想WiFi管理 - Android APK 构建工具"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}错误: 未找到 $1，请确保已安装${NC}"
        exit 1
    fi
}

check_command node
check_command java
check_command keytool

echo -e "${GREEN}环境检查通过${NC}"
echo ""

# 安装依赖
echo "[1/4] 正在安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 依赖安装失败${NC}"
    exit 1
fi

# 清理旧构建
echo "[2/4] 正在清理旧构建..."
cd android
rm -rf app/build build

# 生成签名密钥（如果不存在）
if [ ! -f "app/release.keystore" ]; then
    echo "[3/4] 正在生成签名密钥..."
    keytool -genkeypair -v -storetype PKCS12 -keystore "app/release.keystore" -alias lenovo-wifi-manager -keyalg RSA -keysize 2048 -validity 10000 -storepass lenovo2024 -keypass lenovo2024 -dname "CN=Lenovo WiFi Manager, OU=Lenovo, O=Lenovo, L=Beijing, ST=Beijing, C=CN"
else
    echo "[3/4] 签名密钥已存在，跳过生成"
fi

# 构建 Release APK
echo "[4/4] 正在构建 Release APK..."
./gradlew clean assembleRelease

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: APK 构建失败${NC}"
    cd ..
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}构建成功！${NC}"
echo "=========================================="
echo ""
echo "APK 输出路径:"
echo "  - 通用版 (推荐): android/app/build/outputs/apk/release/app-universal-release.apk"
echo "  - ARM64 (P60 Pro): android/app/build/outputs/apk/release/app-arm64-v8a-release.apk"
echo "  - ARMv7: android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk"
echo ""
echo "安装命令:"
echo "  adb install android/app/build/outputs/apk/release/app-universal-release.apk"
echo ""
