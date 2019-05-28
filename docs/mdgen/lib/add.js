// <!-- ### &nbsp;&nbsp;<b>Fixes & optimizations:</b> -->
// <!-- ### &nbsp;&nbsp;<b>Changes:</b> -->

const fs = require('fs');
const path = require('path');

function loadFile() {
	return fs.readFileSync(path.resolve(__dirname, '../CHANGELOG.md')).toString();
}

function writeFile(data) {
	fs.writeFileSync(path.resolve(__dirname, '../CHANGELOG.md'), data);
}

const ask = (message = '') => new Promise((resolve) => {
	message && process.stdout.write(message);
	var output = '';
	process.stdin.resume();
	process.stdin.on('data', function (d) {
		var input = d.toString().trim();
		var empty = false;
		if (input !== '') {
			output += input + '\n';
		} else if (output === '' && !empty) {
			process.stdout.write('Press again ENTER to cancel, write something to continue.\n');
		} else {
			process.stdin.pause();
			if (output.length > 0) output = output.charAt(0).toUpperCase() + output.substr(1);
			resolve(output.replace(/\n$/, ''));
		}
	});
});

const confirm = (message = 'Confirm?') => new Promise((resolve) => {
	message && process.stdout.write(message + ' (Y/n) ');
	process.stdin.resume();
	process.stdin.on('data', function (d) {
		process.stdin.pause();
		resolve(d.toString().trim().toLowerCase() !== 'n');
	});
});

async function addFix() {
	const message = process.argv.slice(4).join(' ') || await ask('Write "fix" message, press twice ENTER to confirm: ');
	if (message && (await confirm('Add "' + message + '" to "Fixes & optimizations"?'))) {
		const changelog = loadFile()
		.replace('<!-- ### &nbsp;&nbsp;<b>Fixes & optimizations:</b> -->', '### &nbsp;&nbsp;<b>Fixes & optimizations:</b>')
		.replace('### &nbsp;&nbsp;<b>Fixes & optimizations:</b>', '### &nbsp;&nbsp;<b>Fixes & optimizations:</b>\n* ' + message);
		writeFile(changelog);
	} else {
		console.log('Canceled.');
	}
}

async function addChange() {
	const message = process.argv.slice(4).join(' ') || await ask('Write "change" message, press twice ENTER to confirm: ');
	if (message && (await confirm('Add "' + message + '" to "Changes"?'))) {
		const changelog = loadFile()
		.replace('<!-- ### &nbsp;&nbsp;<b>Changes:</b> -->', '### &nbsp;&nbsp;<b>Changes:</b>')
		.replace('### &nbsp;&nbsp;<b>Changes:</b>', '### &nbsp;&nbsp;<b>Changes:</b>\n* ' + message);
		writeFile(changelog);
	} else {
		console.log('Canceled.');
	}
}

function main() {
	const type = process.argv[3] || '';
	if (type.toLowerCase() === 'fix') {
		addFix();
	} else if (type.toLowerCase() === 'change') {
		addChange();
	} else {
		console.log('Missing or unknown type, only "fix" and "change" are allowed.');
	}
}

module.exports = main;
