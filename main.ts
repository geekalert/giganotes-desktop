import { app, BrowserWindow, screen, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';
import {PassThrough} from 'stream';


let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  const DEFAULT_WIDTH = 1280;
  const DEFAULT_HEIGHT = 800;

  const w = (size.width > DEFAULT_WIDTH) ? DEFAULT_WIDTH : size.width;
  const h = (size.height > DEFAULT_HEIGHT) ? DEFAULT_HEIGHT : size.height;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: w,
    height: h,
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

function createStream (text) {
  const rv = new PassThrough();
  rv.push(text);
  rv.push(null);
  return rv;
}

function handleStreamProtocol(request, callback) {
    callback({
        statusCode: 200,
        headers: {
            'content-type': 'text/html'
        },
        data: createStream('<h1>This is a perfectly cromulent response.</h1>')
    });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {

    protocol.registerStreamProtocol('fake', handleStreamProtocol, (err) => {
        if (err) {
            console.error('failed to register protocol handler for HTTP');
            return;
        }

        createWindow();
    });

  });

  // Quit when all windows are closed.
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
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
