@echo off
chcp 65001
cls

echo ==========================================
echo 联想WiFi管理 - Windows 便携版构建
echo ==========================================
echo.
echo 注意: 此脚本使用 electron-builder 创建便携版 EXE
echo.

:: 检查 Node.js
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到 Node.js
    exit /b 1
)

:: 安装 electron 和 electron-builder
echo [1/3] 正在安装 Electron 打包工具...
npm install --save-dev electron electron-builder

:: 创建 Electron 入口文件
echo [2/3] 正在配置 Electron...
(
echo const { app, BrowserWindow } = require^('electron'^);
echo const path = require^('path'^);
echo.
echo function createWindow^(^) {
echo   const mainWindow = new BrowserWindow^({
echo     width: 1200,
echo     height: 800,
echo     webPreferences: {
echo       nodeIntegration: true,
echo       contextIsolation: false,
echo     },
echo     icon: path.join^(__dirname, 'assets', 'icon.ico'^),
echo     title: '联想WiFi管理',
echo   }^);
echo.
echo   // 加载 React Native Web 版本或本地服务器
echo   mainWindow.loadURL^('http://localhost:8081'^);
echo.
echo   // 如果没有本地服务器，加载打包的静态文件
echo   // mainWindow.loadFile^('dist/index.html'^);
echo }
echo.
echo app.whenReady^(^).then^(createWindow^);
echo.
echo app.on^('window-all-closed', ^(^) =^> {
echo   if ^(process.platform !== 'darwin'^) {
echo     app.quit^(^);
echo   }
echo }^);
echo.
echo app.on^('activate', ^(^) =^> {
echo   if ^(BrowserWindow.getAllWindows^(^).length === 0^) {
echo     createWindow^(^);
echo   }
echo }^);
) > electron-main.js

:: 更新 package.json 添加 electron 配置
echo [3/3] 正在构建便携版 EXE...
(
echo {
echo   "name": "lenovo-wifi-manager",
echo   "version": "1.0.0",
echo   "main": "electron-main.js",
echo   "scripts": {
echo     "electron": "electron .",
echo     "electron-build": "electron-builder"
echo   },
echo   "build": {
echo     "appId": "com.lenovowifimanager",
echo     "productName": "联想WiFi管理",
echo     "directories": {
echo       "output": "dist"
echo     },
echo     "files": [
echo       "electron-main.js",
echo       "dist/**/*"
echo     ],
echo     "win": {
echo       "target": [
echo         {
echo           "target": "portable",
echo           "arch": ["x64"]
echo         }
echo       ],
echo       "icon": "assets/icon.ico"
echo     },
echo     "portable": {
echo       "artifactName": "联想WiFi管理-便携版-${version}.exe"
echo     }
echo   }
echo }
) > package-electron.json

echo.
echo 注意: Electron 便携版需要先将 React Native 应用转换为 Web 版本
echo 或使用 Metro bundler 作为本地服务器
echo.
echo 完整构建步骤:
echo   1. 先构建 React Native Windows 版本: npx react-native run-windows --release
echo   2. 然后运行: npm run electron-build
echo.
pause
