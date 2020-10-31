const e = {
	parameters: {
		min: {
			slider: document.querySelector('.slider#minimum'),
			input: document.querySelector('.value-input#minimum')
		},

		max: {
			slider: document.querySelector('.slider#maximum'),
			input: document.querySelector('.value-input#maximum')
		},

		freq: {
			slider: document.querySelector('.slider#frequency'),
			input: document.querySelector('.value-input#frequency')
		}
	},
	submit: document.querySelector('.submit'),
	error: document.querySelector('#submit-error'),
	output: document.querySelector('output'),
	preserveLog: {
		housing: document.querySelector('.housing#preserve-log'),
		circle: document.querySelector('.circle#preserve-log')
	},
	uniqueNumbers: {
		housing: document.querySelector('.housing#unique-numbers'),
		circle: document.querySelector('.circle#unique-numbers')
	}
};

let cStatus = {
	error: false
}

// append data object into output
function loadData() {
	// if data object is not empty
	if (JSON.stringify(data) != '{}') {
		// add output  aka generated numbers to the output panel
		for (i = 1; i < config.outputIndex; i++) {
			appendValue(data['index_' + i].value, i, false);
		}
	}
	if (config.settings.preserveLog) {
		// if preserve log parameter is on
		toggleLog();
		toggleLog();
	}
	if (config.settings.uniqueNumbers) {
		// if unique numbers parameter is on
		toggleMatching();
		toggleMatching();
	}
	e.parameters.min.slider.value = config.parameters.min;
	e.parameters.min.input.value = config.parameters.min;
	e.parameters.max.slider.value = config.parameters.max;
	e.parameters.max.input.value = config.parameters.max;
	e.parameters.freq.slider.value = config.parameters.freq;
	e.parameters.freq.input.value = config.parameters.freq;
}
loadData();

// change value everytime the sliders are changed

// minimum value checker
// execute this code when you detect changes to the controls



/****
 * This if statement checks 
 * * if Unique Numbers parameter is on
 * * if the frequency value (how many numbers to generate) is bigger than the difference of the maximum and minimum value
 * * * because you can't generate more than 5 unique numbers between 1 and 5
*/
// minimum slider checker
e.parameters.min.slider.addEventListener('input', () => {
	errorChecker('Minimum', 'min', 0, 998, 'slider');
});
// minimum input checker
e.parameters.min.input.addEventListener('input', () => {
	errorChecker('Minimum', 'min', 0, 998, 'input');
});

// maximum slider checker
e.parameters.max.slider.addEventListener('input', () => {
	errorChecker('Maximum', 'max', 1, 1000, 'slider');
});
// maximum value checker
e.parameters.max.input.addEventListener('input', () => {
	errorChecker('Maximum', 'max', 1, 1000, 'input');
});

// slider frequency checker
e.parameters.freq.slider.addEventListener('input', () => {
	errorChecker('Frequency', 'freq', 1, 250, 'slider');
});
// frequency checker
e.parameters.freq.input.addEventListener('input', () => {
	errorChecker('Frequency', 'freq', 1, 250, 'input');
});

// checkers
function syntaxChecker(int) {
	int = Number(int);
	return Number.isInteger(int);
}


function errorChecker(inputName, object, min, max, type) {
		// check if the max value is smaller than minimum value
		if (Number(e.parameters.max[type].value) < Number(e.parameters.min[type].value)) {
			errorTrigger('Minimum value cannot be higher than Maximum value.');
		} else if (config.settings.uniqueNumbers) {
			
			// check if frequency number is higher than the difference if UniqueNumbers is true
			if(Number(e.parameters.freq[type].value) > Number(e.parameters.max[type].value) - Number(e.parameters.min[type].value) + 1) {
				errorTrigger('Cannot generate unique numbers given the range.');
			} else {
				resetError();
			}
		} else {
			resetError();
		}

	// if it is an input
	if (type == 'input') {
		// make sure it isn't empty
		if (e.parameters[object].input.value == '') {
			errorTrigger(inputName + ' value cannot be empty.');

			// nor smaller than minimum allowed
		} else if (e.parameters[object].input.value < min) {
			errorTrigger(inputName + ' value cannot be smaller than ' + min + '.');

			// nor bigger than maximum allowed
		} else if (e.parameters[object].input.value > max) {
			errorTrigger(inputName + ' value cannot be greater than ' + max + '.');

			// also check if the value is a number only
		} else if (syntaxChecker(e.parameters[object].input.value)) {


			// convert input value to int and assign to config
			config.parameters[object] = Number(e.parameters[object].input.value);
			
			// assign input value to slider
			e.parameters[object].slider.value = e.parameters[object].input.value;
			
		} else {
			errorTrigger('Invalid value. Only numbers are permitted.');
		}
	} else {
		// if it is a slider

		// convert slider value to int and assign to config
		config.parameters[object] = Number(e.parameters[object].slider.value);
		
		
		// assign slider value to input
		e.parameters[object].input.value = e.parameters[object].slider.value;

	}


}
// reset error on the user's screen
function resetError() {
	e.error.classList.add('no-error');
	e.submit.classList.remove('disabled');
}
function errorTrigger(msg) {
	// show error
	e.error.textContent = msg;
	e.error.classList.remove('no-error');


	// disable button
	e.submit.classList.add('disabled');
}

function submit() {
	// check if max value is bigger than minimum value
	// check if preserve log is false
	if (!config.settings.preserveLog) {
		clearLog();
	}
	for (i = 1; i <= config.parameters.freq; i++) {
		// generate number
		generate();
	}
}

function generate() {
	let gen = Math.floor(Math.random() * (config.parameters.max - config.parameters.min + 1) + config.parameters.min);
	if (config.settings.uniqueNumbers) {
		let duplicated = checkDuplicates(gen);
		if (!duplicated) {
			appendValue(gen, config.outputIndex, true);
		} else {
			generate();
		}
	} else {
		appendValue(gen, config.outputIndex, true);
	}
}

function checkDuplicates(gen) {
	gen = Number(gen);

	// default false
	var duplicated = false;
	for (let i = 1; i < config.outputIndex; i++) {
		if (gen == data['index_' + i].value) {
			// if it matches any of the values, then set duplicated to true
			duplicated = true;
		}
		break;
	}
	return duplicated;
}

function appendValue(gen, index, appendData) {
	// create gen div
	var genParent = document.createElement('div');
	genParent.setAttribute('class', 'gen-parent');
	genParent.setAttribute('id', 'index_' + index);
	genParent.setAttribute('data-id', gen);
	genParent.setAttribute('onclick', 'copy(this)');
	genParent.addEventListener('contextmenu', genParentFocus);
	e.output.appendChild(genParent);

	// create prefix
	var genPrefix = document.createElement('span');
	genPrefix.setAttribute('class', 'output-msg output-prefix');
	genPrefix.textContent = index + '.-> ';
	genPrefix.style = 'user-select: none';
	genParent.appendChild(genPrefix);

	// create generated number
	var genDOM = document.createElement('span');
	genDOM.setAttribute('class', 'output-msg');
	genDOM.setAttribute('id', gen);
	genDOM.textContent = gen;
	genParent.appendChild(genDOM);
	
	if (appendData) {
		// add data to object
		data['index_' + config.outputIndex] = {
			value: gen,
			index: config.outputIndex
		};
		config.outputIndex++;
	}
	e.output.scrollTop = e.output.scrollHeight;
}
function genParentFocus(e) {
	let id = e.target.id;
	let classList = e.target.classList[0];
	if(classList == 'gen-parent') {

		let query = '.' + classList + '#' + id;
		// clear focus on all gen-parents
		for (i = 0; i < document.getElementsByClassName(classList).length; i++) {
			document.getElementsByClassName(classList)[i].classList.remove('gen-parent-focus');
		}
		document.querySelector(query).classList.add('gen-parent-focus');
	}
}
function copy(e) {
	// fetch class and id of HTML element
	let id = e.id;
	let classList = e.classList[0];
	// put them together into a query
	let query = '.' + classList + '#' + id;

	// clear focus on all gen-parents
	for (i = 0; i < document.getElementsByClassName(classList).length; i++) {
		document.getElementsByClassName(classList)[i].classList.remove('gen-parent-focus');
	}

	// focus on gen-parent
	document.querySelector(query).classList.add('gen-parent-focus');

	// create input
	let copyInput = document.createElement('input');
	copyInput.setAttribute('class', 'disabled');
	copyInput.value = data[id].value;
	document.body.appendChild(copyInput);

	// copy input
	copyInput.select();
	document.execCommand('copy');
	// remove input
	document.body.removeChild(copyInput);
	
	// show that output was copied
	let copyMessage = document.createElement('span');
	copyMessage.setAttribute('class', 'copied');
	copyMessage.textContent = 'Copied!';
	document.querySelector(query).appendChild(copyMessage);

	// draw out, then delete
	setTimeout(() => {
		copyMessage.classList.add('copied-draw-out');
		setTimeout(() => {
			document.querySelector(query).removeChild(copyMessage);
		}, 200);
		document.querySelector(query).classList.remove('gen-parent-focus');
	}, 1000);
	
}

function toggleLog() {
	// if preserved log is false
	if (!config.settings.preserveLog) {
		config.settings.preserveLog = true;
		toggleSwitch('on', e.preserveLog);
		if (config.settings.uniqueNumbers) {
			toggleMatching();
		}
	} else {
		config.settings.preserveLog = false;
		toggleSwitch('off', e.preserveLog);
	}
}

function toggleSwitch(action, component) {
	if (action == 'on') {
		// css effects
		component.housing.classList.add('active');
		component.circle.classList.add('active');
	} else if (action == 'off') {
		// css effects
		component.housing.classList.remove('active');
		component.circle.classList.remove('active');
	}
}

function toggleMatching() {
	
	if (!config.settings.uniqueNumbers) {

		if (config.parameters.freq < config.parameters.max - config.parameters.min + 1) {
			// turn unique numbers button on
			toggleSwitch('on', e.uniqueNumbers);
			config.settings.uniqueNumbers = true;

			// if preserve button is already on, then turn it off
			if (config.settings.preserveLog) {
				toggleLog();
			}
		}
	} else if (config.settings.uniqueNumbers) {
		config.settings.uniqueNumbers = false;
		toggleSwitch('off', e.uniqueNumbers);
		resetError();	
	}
}

function clearLog() {
	// clear output/log
	e.output.innerHTML = '';
	console.log('%c NOTICE: Output cleared!', terminal.green);
	// clear data object

	data = {};
	// reset data header
	config.outputIndex = 1;
}
