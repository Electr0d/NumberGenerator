const electron = require('electron');
const { app, BrowserWindow } = electron;
const url = require('url');
const path = require('path');

let mainWindow;

app.on('ready', function() {
	console.log('NOTICE: Ready!');
	// create new window
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		minWidth: 900,
		minHeight: 750
	});
	// load html into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname + '/index/index.html'),
			protocol: 'file:',
			slashes: true
		})
	);
});
