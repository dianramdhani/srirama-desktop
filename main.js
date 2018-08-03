const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// let pyProc = null;
// app.on('ready', () => {
//     const PY_DIST_FOLDER = 'dist',
//         PY_MODULE = 'api';
//     pyProc = require('child_process').execFile(getScriptPath(), ['4343'])

//     function getScriptPath() {
//         if (process.platform === 'win32') {
//             return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + '.exe')
//         }
//         return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
//     }
// });
// app.on('will-quit', () => {
//     pyProc.kill();
//     pyProc = null;
// });

app.on('ready', () => {
    var { width, height } = require('electron').screen.getPrimaryDisplay().size,
        main = new BrowserWindow({
            center: true,
            width: width,
            height: height
        });
    main.setMenu(null);

    main.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // untuk pengujian 
    // main.loadURL('http://127.0.0.1:5500/src/');
    main.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});