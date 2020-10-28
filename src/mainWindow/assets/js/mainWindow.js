const miniDOM = document.querySelector('.slider#minimum'),
	maxDOM = document.querySelector('.slider#maximum'),
	frequencyDOM = document.querySelector('.slider#frequency'),
	btnSubmit = document.querySelector('.submit'),
	lblMini = document.querySelector('.value-input#minimum'),
	lblMax = document.querySelector('.value-input#maximum'),
	lblFrequency = document.querySelector('.value-input#frequency'),
	errorDOM = document.querySelector('#submit-error'),
	// output
	output = document.querySelector('output');

var miniValue = config.parameters.min;
var maxValue = config.parameters.max;
var frequencyValue = config.parameters.freq;




// append data object into output
function init() {
	// if data object is not empty
	if (data != {}) {
		// add output  aka generated numbers to the output panel
		for (i = 1; i <= config.outputIndex - 1; i++) {
			var gen = data['index_' + i].value;
			// create gen div
			var genParent = document.createElement('div');
			genParent.setAttribute('class', 'gen-parent');
			genParent.setAttribute('id', 'index_' + i);
			genParent.setAttribute('data-id', gen);
			genParent.setAttribute('onclick', 'copy(this)');
			output.appendChild(genParent);

			// create prefix
			var genPrefix = document.createElement('span');
			genPrefix.setAttribute('class', 'output-msg');
			genPrefix.textContent = i + '. ->';
			genPrefix.style = 'user-select: none';
			genParent.appendChild(genPrefix);

			// create generated number
			var genDOM = document.createElement('span');
			genDOM.setAttribute('class', 'output-msg');
			genDOM.setAttribute('id', gen);
			genDOM.textContent = gen;
			genParent.appendChild(genDOM);
			output.scrollTop = output.scrollHeight;
			console.log('%c NOTICE: Appending ' + data['index_' + i].value + ' at index ' + i, terminal.blueColor);
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
	miniDOM.value = config.parameters.min;
	lblMini.value = config.parameters.min;
	maxDOM.value = config.parameters.max;
	lblMax.value = config.parameters.max;
	frequencyDOM.value = config.parameters.freq;
	lblFrequency.value = config.parameters.freq;
}
init();
// change value everytime the sliders are changed

// minimum value checker
// execute this code when you detect changes to the controls
miniDOM.addEventListener('input', function() {
	// reassign variables
	config.parameters.min = Number(miniDOM.value);
	// update the number on screen
	lblMini.value = miniDOM.value;
	/****
	 * This if statement checks 
	 * * if Unique Numbers parameter is on
	 * * if the frequency value (how many numbers to generate) is bigger than the difference of the maximum and minimum value
	 * * * because you can't generate more than 5 unique numbers between 1 and 5
	*/
	if (config.settings.uniqueNumbers && config.parameters.freq > config.parameters.max - config.parameters.min) {
		errorTrigger('Cannot generate unique numbers given the range.');
	} else {
		resetError();
	}
	errorChecker();
});
// check the input value
lblMini.addEventListener('input', function() {
	// make sure it isn't empty
	if (lblMini.value == '') {
		errorTrigger('Minimum value cannot be empty.');
		// nor smaller than 0
	} else if (lblMini.value < 0) {
		errorTrigger('Minimum value smaller than 0.');
		// nor bigger than 998
	} else if (lblMini.value > 998) {
		errorTrigger('Minimum value greater than 998.');
		// also check if the value is a number only
	} else if (syntaxChecker(lblMini.value)) {
		resetError();
		config.parameters.min = Number(lblMini.value);
		miniDOM.value = lblMini.value;
		errorChecker();
	} else {
		errorTrigger('Invalid value. Only numbers are permitted.');
	}
});

// maximum value checker
maxDOM.addEventListener('input', function() {
	config.parameters.max = Number(maxDOM.value);
	lblMax.value = maxDOM.value;
	errorChecker();
});
lblMax.addEventListener('input', function() {
	if (lblMax.value == '') {
		// nor smaller than 0
		errorTrigger('Maxmimum value cannot be empty.');
		// nor bigger than 998
	} else if (lblMax.value < 1) {
		errorTrigger('Maxmimum value smaller than 1.');
		// also check if the value is a number only
	} else if (lblMax.value > 1000) {
		errorTrigger('Maxmimum value greater than 1000.');
	} else if (syntaxChecker(lblMax.value)) {
		resetError();
		config.parameters.max = Number(lblMax.value);
		maxDOM.value = lblMax.value;
		errorChecker();
	} else {
		errorTrigger('Invalid value. Only numbers are permitted.');
	}
});

// frequency checker
frequencyDOM.addEventListener('input', function() {
	config.parameters.freq = Number(frequencyDOM.value);
	lblFrequency.value = frequencyDOM.value;
	errorChecker();
});
lblFrequency.addEventListener('input', function() {
	if (lblFrequency.value == '') {
		errorTrigger('Frequency value cannot be empty.');
	} else if (lblFrequency.value < 1) {
		errorTrigger('Frequency value cannot be smaller than 1.');
	} else if (lblFrequency.value > 250) {
		errorTrigger('Frequency value cannot be greater than 250.');
	} else if (syntaxChecker(lblFrequency.value)) {
		resetError();
		config.parameters.freq = Number(lblFrequency.value);
		frequencyDOM.value = lblFrequency.value;
		errorChecker();
	} else {
		errorTrigger('Invalid value. Only numbers are permitted.');
	}
});

// checkers
function syntaxChecker(int) {
	int = Number(int);
	return Number.isInteger(int);
}
function errorChecker() {
	// check if the max value is smaller than minimum value
	if (config.parameters.max < config.parameters.min) {
		errorTrigger('Minimum value cannot be higher than Maximum value.');
	} else if (
		config.settings.uniqueNumbers &&
		config.parameters.freq > config.parameters.max - config.parameters.min + 1
	) {
		errorTrigger('Cannot generate unique numbers given the range.');
	} else {
		// reset error
		resetError();
	}
}
// reset error on the user's screen
function resetError() {
	errorDOM.classList.remove('error');
	btnSubmit.classList.remove('disabled');
}
function errorTrigger(msg) {
	// show error
	errorDOM.classList.add('error');
	errorDOM.textContent = msg;
	// disable button
	btnSubmit.classList.add('disabled');
}

function submitFunc() {
	// check if max value is bigger than minimum value
	if (!onCopy && config.parameters.max > config.parameters.min) {
		// check if preserve log is false
		if (!config.settings.preserveLog) {
			clearLog();
		}
		for (i = 1; i <= config.parameters.freq; i++) {
			// generate number
			generate();
		}
	} else {
		errorChecker();
	}
}

function generate() {
	var gen = genFunc(config.parameters.min, config.parameters.max);
	if (config.settings.uniqueNumbers) {
		var duplicates = checkDuplicates(gen);
		if (!duplicates) {
			appendValue(gen, true);
		} else {
			generate();
		}
	} else {
		appendValue(gen, true);
	}
}
function genFunc(min, max) {
	// generate a random number
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function checkDuplicates(gen) {
	gen = Number(gen);
	var duplicates = false;
	for (i = 1; i < config.outputIndex; i++) {
		if (gen == data['index_' + i].value) {
			duplicates = true;
		}
	}
	return duplicates;
}

function appendValue(gen, appendData) {
	if (appendData) {
		// add data to object
		data['index_' + config.outputIndex] = {
			value: gen,
			index: config.outputIndex
		};
	}

	// create gen div
	var genParent = document.createElement('div');
	genParent.setAttribute('class', 'gen-parent');
	genParent.setAttribute('id', 'index_' + config.outputIndex);
	genParent.setAttribute('data-id', gen);
	genParent.setAttribute('onclick', 'copy(this)');
	output.appendChild(genParent);

	// create prefix
	var genPrefix = document.createElement('span');
	genPrefix.setAttribute('class', 'output-msg');
	genPrefix.textContent = config.outputIndex + '. ->';
	genPrefix.style = 'user-select: none';
	genParent.appendChild(genPrefix);
	config.outputIndex++;

	// create generated number
	var genDOM = document.createElement('span');
	genDOM.setAttribute('class', 'output-msg');
	genDOM.setAttribute('id', gen);
	genDOM.textContent = gen;
	genParent.appendChild(genDOM);
	output.scrollTop = output.scrollHeight;
}

var onCopy = false;
function copy(num) {
	if (!onCopy) {
		onCopy = true;
		// fetch class and id of HTML element
		var id = num.id;
		var classList = num.classList;
		// put them together into a query
		var query = '.' + classList + '#' + id;

		// clear focus on all gen-parents
		for (i = 0; i < document.getElementsByClassName(classList).length; i++) {
			document.getElementsByClassName(classList)[i].classList.remove('gen-parent-focus');
		}

		// focus on gen-parent
		document.querySelector(query).classList.add('gen-parent-focus');

		// create input
		var copyInput = document.createElement('input');
		copyInput.setAttribute('class', 'disabled');
		copyInput.style = 'transform: scale(0); transition: 0s';
		copyInput.value = data[id].value;
		document.body.appendChild(copyInput);
		copyInput = document.querySelector('input.disabled');
		// copy input
		copyInput.select();
		var copied = false;
		copied = document.execCommand('copy');
		// remove input
		document.body.removeChild(copyInput);
		// display result
		if (copied) {
			console.log('%c NOTICE: Copied ' + data[id].value + ' to clipboard!', terminal.green);
		} else {
			console.log('%c ERROR: Failed to copy ' + data[id].value + ' to clipboard!', terminal.redColor);
		}
		// show that output was copied
		var copyMessage = document.createElement('span');
		copyMessage.setAttribute('class', 'copied');
		copyMessage.textContent = 'Copied!';
		document.querySelector(query).appendChild(copyMessage);
		setTimeout(function() {
			copyMessage.classList.add('copied-draw-out');
		}, 1000);
		setTimeout(function() {
			document.querySelector(query).removeChild(copyMessage);
			onCopy = false;
		}, 1200);
	}
}

function toggleLog() {
	// if preserved log is false
	var housing = document.querySelector('.housing#preserve-log');
	var circle = document.querySelector('.circle#preserve-log');
	if (!config.settings.preserveLog) {
		config.settings.preserveLog = true;
		toggleCheckbox('on', housing, circle);
		if (config.settings.uniqueNumbers) {
			toggleMatching();
		}
	} else {
		config.settings.preserveLog = false;
		toggleCheckbox('off', housing, circle);
	}
}

function toggleCheckbox(action, housing, circle) {
	// console.log('action: ' + action + '. housing: ' + housing + '. circle: ' + circle);
	if (action == 'on') {
		// css effects
		housing.classList.add('housing-green');
		circle.style = 'transform: translateX(100%)';
	} else if (action == 'off') {
		// css effects
		housing.classList.remove('housing-green');
		circle.style = 'transform: translateX(0%)';
	}
}

function toggleMatching() {
	var housing = document.querySelector('.housing#unique-numbers');
	var circle = document.querySelector('.circle#unique-numbers');
	if (!config.settings.uniqueNumbers) {
		// if it is impossible to create unique numebers
		if (config.parameters.freq > config.parameters.max - config.parameters.min + 1) {
			// don't do anything
		} else {
			// turn unique numbers button on
			config.settings.uniqueNumbers = true;
			toggleCheckbox('on', housing, circle);
			// if preserve button is already on, then turn it off
			if (config.settings.preserveLog) {
				toggleLog();
			}
		}
	} else if (config.settings.uniqueNumbers) {
		config.settings.uniqueNumbers = false;
		toggleCheckbox('off', housing, circle);
		// if error is already triggered
		if (config.parameters.freq > config.parameters.max - config.parameters.min + 1) {
			resetError();
		}
		errorChecker();
	}
}

function clearLog() {
	if (onCopy) {
	} else {
		// clear output/log
		output.innerHTML = '';
		console.log('%c NOTICE: Output cleared!', terminal.green);
		// clear data object
		data = {};
		// reset data header
		config.outputIndex = 1;
	}
}
