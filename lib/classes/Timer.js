const timers = {};
var globalIndex = 0;

function prettify(time) {
	var str = ''; 
	var rest = time;	
	const hours = Math.floor(time / (36e5));
	if (hours > 0) str += hours + 'h';
	rest = time % 36e5;
	const minutes = Math.floor(rest / (6e4));
	if (minutes > 0) str += (str ? ' ' : '') + minutes + 'm';
	rest = time % 6e4;
	const seconds = Math.floor(rest / (1e3));
	if (seconds > 0) str += (str ? ' ' : '') + seconds + 's';
	rest = time % 1e3;
	const millis = rest;
	if (millis > 0) str += (str ? ' ' : '') + millis + 'ms';
	return str;
}

class Timer {
	time = 0;
	id;
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
	get id() { return this.id };
	set id(next) {};
	get value() {
		const value = (this.time > 0 ? Date.now() : 0) - this.time;
		return {
			get pretty() { return prettify(value) },
			toString() { return value }
		};
	}
	start() {
		if (this.time <= 0) {
			this.time += Date.now();
		}
	}
	stop() {
		if (this.time > 0) {
			this.time -= Date.now();
		}
	}
	resolve() {
		this.stop();
		delete timers[this.id];
		return this.value;
	}
	toString() {
		return this.id;
	}
}

function getByName(findName) {
	return Object.values(timers).find(({ name }) => ( name === findName ));
}
function getTimer(idOrName) {
	if (typeof idOrName === 'string') {
		return getByName(idOrName);
	} else if (typeof idOrName === 'number') {
		return timers[idOrName];
	} else return undefined;
}
function newTimer(name) {
	const index = ++globalIndex;
	const timer = new Timer(index, name);
	timers[index] = timer;
	return timer;
}
function start(idOrName) {
	var timer;
	if (idOrName) timer = getTimer(idOrName);
	if (!timer) {
		if (typeof idOrName === 'number') return false;
		else timer = newTimer(idOrName);
	}
	timer.start();
	return timer;
}
function stop(idOrName, deleteTimer = false) {
	var timer;
	if (idOrName) timer = getTimer(idOrName);
	if (timer) { 
		timer.stop(deleteTimer);
		return true;
	} else {
		return undefined;
	}
}
function resolve(idOrName) {
	var timer;
	if (idOrName) timer = getTimer(idOrName);
	if (timer) { 
		return timer.resolve();
	} else {
		return undefined;
	}
}
function valueOf(idOrName) {
	var timer;
	if (idOrName) timer = getTimer(idOrName);
	if (timer) { 
		return timer.value();
	} else {
		return undefined;
	}
}

module.exports = {
	// Timer,
	get: getTimer,
	new: newTimer,
	start,
	stop,
	valueOf,
	resolve
};
