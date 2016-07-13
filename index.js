const {app, BrowserWindow} = require('electron');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({width: 400, minWidth: 400, height: 300, minHeight: 300, frame: false, show: true, experimentalFeatures: true, experimentalCanvasFeatures: true});
    win.setMenu(null);
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.openDevTools();
    win.on('closed', () => win = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

app.on('activate', () => win === null && createWindow());
