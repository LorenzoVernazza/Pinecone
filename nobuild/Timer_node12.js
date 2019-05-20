const timers = {};
var globalIndex = 0;

function prettify(time) {
	var rest = time;
	const hours = Math.floor(time / (36e5));
	rest = time % 36e5;
	const minutes = Math.floor(rest / (6e4));
	rest = time % 6e4;
	const seconds = Math.floor(rest / (1e3));
	rest = time % 1e3;
	const millis = rest;

	return `${hours > 0 ? hours + 'h' + ' ' : ''}${minutes > 0 ? minutes + 'm' + ' ' : ''}${seconds > 0 ? seconds + 's' + ' ' : ''}${millis > 0 || time == 0 ? millis + 'ms' + ' ' : ''}`
}

class Timer {
	#value = 0;
	#time = 0;
	#id;
	constructor(id, name) {
		this.#id = id;
		this.name = name;
	}
	get id() {
		return this.#id;
	}
	start() {
		if (!this.#time) this.#time = Date.now();
	}
	stop() {
		if (this.#time) { 
			this.#value += Date.now() - this.#time;
			this.#time = 0;
		}
	}
	resolve() {
		this.stop();
		delete timers(this.#id);
		return {
			toString() { return this.#value },
			get pretty() { return prettify(this.#value) }
		};
	}
	toString() {
		return this.#id;
	}
}

function getByName(findName) {
	return Object.values(timers).find(({ name }) => { name === findName });
}
function getTimer(idOrName) {
	if (typeof idOrName === 'string') {
		return getByName(idOrName);
	} else if (typeof idOrName === 'number') {
		return timers[idOrName];
	} else return undefined;
}
function newTimer(name) {
	return new Timer(++globalIndex, name)
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
function stop(idOrName) {
	var timer;
	if (idOrName) timer = getTimer(idOrName);
	if (timer) { 
		timer.stop();
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

module.exports = {
	get: getTimer,
	new: newTimer,
	start,
	stop,
	resolve
};

// TEST
console.log(getByName('test'))