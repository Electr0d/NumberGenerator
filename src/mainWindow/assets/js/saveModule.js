const fs = require('fs')
const path = require('path');


const dataPath = path.join(__dirname + '../../save/data.json');
const configPath = path.join(__dirname + '../../save/config.json');

var saveOn = false;
// objects
var data = {};
var config = {
  parameters: {
    min: 0,
    max: 1,
    freq: 1
  },
  settings: {
    preserveLog: false,
    uniqueNumbers: false
  },
	outputIndex: 1
};

// for console
const terminal = {
  red: 'color: rgb(200, 50, 50)',
  green: 'color: rgb(50, 200, 50)',
  orange: 'color: rgb(233, 119, 27)',
  blue: 'color: rgb(150, 200, 255)'
}


/*** LOAD SAVED DATA ***/
// read saved data
data = unpack(dataPath);
config = unpack(configPath);
console.log(config);


function pack(object, path) {
	fs.writeFile(path, JSON.stringify(object), (err) => {
		if (err) throw err;
		console.log('%c Object has been saved!', terminal.green);
	});
}
function unpack(path) {
	return JSON.parse(fs.readFileSync(path));
}



// check if either of the two object is changed paramters changed, new generated numbers, etc.
function autoSave() {
	var currentData = JSON.stringify(data)
  var savedData = fs.readFileSync(dataPath)
  
	var currentConfig = JSON.stringify(config);
	var savedConfig = fs.readFileSync(configPath);

	if (currentData != savedData || currentConfig != savedConfig) {
		if (!saveOn) {
			saveOn = true;
			save('show');
		}
	} else {
		if (saveOn) {
			save('hide');
			saveOn = false;
		}
	}
}

// trigger the auto save every two seconds
setTimeout(function() {
	setInterval(autoSave, 400);
}, 2000);



/** Save output and parameters to an external file **/
function save(action, object, path) {
	switch (action) {
		case 'show':
			// show save button
			// create save button
			var saveBtn = document.createElement('button');
			saveBtn.setAttribute('class', 'save');
			saveBtn.setAttribute('onclick', "save('all')");
			saveBtn.textContent = 'Save';
			document.body.appendChild(saveBtn);
			break;
		case 'hide':
			// hide save button
			var saveBtn = document.querySelector('.save');
			saveBtn.classList.add('save-out');

			setTimeout(function() {
				document.body.removeChild(saveBtn);
			}, 310);

			break;
		case 'save':
			// save file
			pack(object, path);
			console.table(object);
			break;
		case 'all':
			// hide save button
			save('hide');
			save('save', data, dataPath);
			save('save', config, configPath);
			saveOn = false;
			break;
		default:
			console.log('%c ERROR: action: "' + action + '" is not valid', termina.red);
	}
}


