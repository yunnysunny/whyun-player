const electron = require('electron');
// const fs = require('fs');
// const path = require('path');
const globalShortcut = electron.globalShortcut;
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

global.releaseVersion = false;

function createWindow() {
    // 创建窗体
    mainWindow = new BrowserWindow({
        width: 1280, height: 720,
        webPreferences: {
            tabbingIdentifier: 'groups',
            webSecurity: false,
            nodeIntegration: false,
            // preload: path.join(__dirname, 'interface.js'),
            plugins: true
        }
    });

    // 注册打开控制台的快捷键
    globalShortcut.register('CommandOrControl+P+0', function () {
        mainWindow.webContents.openDevTools();
    });

    // 加载首页
    mainWindow.loadURL('file://' + __dirname + '/../demo.html#debug=1');

    // 创建窗体时打开控制台
    //   mainWindow.webContents.openDevTools()

    // 监听关闭窗体事件
    mainWindow.on('closed', function () {
        mainWindow = null;
    });


}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
