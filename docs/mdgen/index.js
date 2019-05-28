const task = process.argv[2];
const gen = require('./lib/gen');
const add = require('./lib/add');

if (task === 'gen') {
	gen();
} else if (task === 'add') {
	add();
} else {
	console.log('Missing or unknown command.');
}
