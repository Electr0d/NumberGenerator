const electron = require('electron');
const { app, BrowserWindow } = electron;
const url = require('url');
const path = require('path');
const { Menu } = require('electron');

let mainWindow;

app.on('ready', function() {
	console.log('NOTICE: Ready!');
	// create new window
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		},
		minWidth: 900,
		minHeight: 700,
		frame: false,
		icon: path.join(__dirname, '/src/global_assets/icon/icon.png')
	});
	
	// load html into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname + '/src/mainWindow/mainWindow.html'),
			protocol: 'file:',
			slashes: true,
		})
	);
});
// Menu.setApplicationMenu(false);
