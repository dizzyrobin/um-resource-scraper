const {app, BrowserWindow} = require('electron');
const {download} = require('electron-dl');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadFile('dist/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // ipcMain.on('download', (event, info) => {
  //   console.log("Gonna download " + info.url);
  //   console.log("With propierties: " + JSON.stringify(info.properties));
  //   download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
  //     .then(dl => mainWindow.webContents.send('download complete', dl.getSavePath()));
  // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
