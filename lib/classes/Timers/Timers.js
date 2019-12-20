const { colorize } = require('../../utils');
const timers = {};
var globalIndex = 0;

function stdValues(time) {
	var rest = time;
	const hours = Math.floor(rest / (36e5));
	// if (hours > 0) str += hours + 'h';
	rest %= 36e5;
	const minutes = Math.floor(rest / (6e4));
	// if (minutes > 0) str += (str ? ' ' : '') + minutes + 'm';
	rest %= 6e4;
	const seconds = Math.floor(rest / (1e3));
	// if (seconds > 0) str += (str ? ' ' : '') + seconds + 's';
	rest %= 1e3;
	const millis = rest;
	// if (millis > 0) str += (str ? ' ' : '') + millis + 'ms';

	return {
		hours,
		minutes,
		seconds,
		milliseconds: millis
	};
}

function hrValues(_seconds, _nanoseconds) {
	var rest = _seconds + Math.floor(_nanoseconds / 1e9);
	const hours = Math.floor(rest / (3600));
	// if (hours > 0) str += hours + 'h';
	rest %= 3600;
	const minutes = Math.floor(rest / (60));
	// if (minutes > 0) str += (str ? ' ' : '') + minutes + 'm';
	rest %= 60;
	const seconds = rest;
	// if (seconds > 0) str += (str ? ' ' : '') + seconds + 's';

	rest = _nanoseconds % 1e9;
	const millis = Math.floor(rest / (1e6));
	// if (millis > 0) str += (str ? ' ' : '') + millis + 'ms';
	rest %= 1e6;
	const nanos = rest;
	// if (nanos > 0) str += (str ? ' ' : '') + nanos + 'ns';

	return {
		hours,
		minutes,
		seconds,
		milliseconds: millis,
		nanoseconds: nanos
	};
}

function prettify({ hours, minutes, seconds, milliseconds, nanoseconds }, small = true, digitsColor, unitsColor) {
	var str = '';
	function colorDigit(digit) {
		if (digitsColor) return colorize(digit, digitsColor);
		else return ('' + digit);
	}
	function colorUnit(unit) {
		if (unitsColor) return colorize(unit, unitsColor);
		else return ('' + unit);
	}
	if (hours > 0) str += colorDigit(hours) + colorUnit(small ? 'h' : 'hours');
	if (minutes > 0) str += (str ? ' ' : '') + colorDigit(minutes) + colorUnit(small ? 'm' : 'minutes');
	if (seconds > 0) str += (str ? ' ' : '') + colorDigit(seconds) + colorUnit(small ? 's' : 'seconds');
	if (milliseconds > 0) str += (str ? ' ' : '') + colorDigit(milliseconds) + colorUnit(small ? 'ms' : 'milliseconds');
	if (nanoseconds > 0) str += (str ? ' ' : '') + colorDigit(nanoseconds) + colorUnit(small ? 'ns' : 'nanoseconds');
	return str;
}

function hrSum([_secondsA = 0, _nanosecondsA = 0], [_secondsB = 0, _nanosecondsB = 0], sub = false) {
	// console.log(sub ? 'SUBSCTRACTING' : 'SUMMING', [_secondsA, _nanosecondsA], [_secondsB, _nanosecondsB]);
	let seconds = _secondsA + (_secondsB * (sub ? -1 : 1));
	let nanoseconds = _nanosecondsA + (_nanosecondsB * (sub ? -1 : 1));
	// console.log('FIRST RESULT', [seconds, nanoseconds]);
	const sSign = seconds >= 0 ? 1 : -1;
	const nSign = nanoseconds >= 0 ? 1 : -1;
	if (sSign !== nSign) {
		// console.log('Different', sSign, nSign);
		seconds += nSign;
		nanoseconds += sSign * 1e9;
	} else {
		// console.log('Equal', sSign, nSign);
		seconds += (nSign * Math.floor(Math.abs(nanoseconds) / 1e9));
		nanoseconds %= 1e9;
	}
	// console.log('FINAL RESULT', [seconds, nanoseconds]);
	return [seconds, nanoseconds];
}

class Timer {
	constructor(id, name) {
		this.time = 0;
		Object.defineProperty(this, 'id', {
			writable: false,
			value: id
		});
		this.name = name;
	}
	get value() {
		const value = (this.time > 0 ? Date.now() : 0) - this.time;
		return {
			get pretty() { return prettify(stdValues(value)); },
			get values() { return stdValues(value); },
			prettyPrint(small, digitsColor, unitsColor) { return prettify(stdValues(value), small, digitsColor, unitsColor); },
			toString() { return '' + value; }
		};
	}
	start() {
		if (this.time <= 0) {
			this.time += Date.now();
		}
		return this;
	}
	stop() {
		if (this.time > 0) {
			this.time -= Date.now();
		}
		return this;
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

class HRTimer {
	constructor(id, name) {
		this.seconds = 0;
		this.nanoseconds = 0;
		Object.defineProperty(this, 'id', {
			writable: false,
			value: id
		});
		this.name = name;
	}
	get value() {
		const [_seconds, _nanoseconds] = process.hrtime();
		const [seconds, nanoseconds] = hrSum(
			(this.seconds >= 0 && this.nanoseconds >= 0) ? [_seconds, _nanoseconds] : [0, 0],
			[this.seconds, this.nanoseconds],
			true
		);
		// console.log([_seconds, _nanoseconds], [this.seconds, this.nanoseconds], [seconds, nanoseconds]);
		return {
			get values() { return hrValues(seconds, nanoseconds); },
			get pretty() { return prettify(hrValues(seconds, nanoseconds)); },
			prettyPrint(small, digitsColor, unitsColor) { return prettify(hrValues(seconds, nanoseconds), small, digitsColor, unitsColor); },
			seconds,
			nanoseconds,
			toString() { return '' + ((seconds * 1000) + (Math.floor(nanoseconds / 1e6))) + '.' + ('' + (nanoseconds % 1e6)).padStart(6, '0').replace(/0+$/, ''); }
		};
	}
	start() {
		// console.log('START', [this.seconds, this.nanoseconds]);
		if (this.seconds <= 0) {
			([
				this.seconds,
				this.nanoseconds
			] = hrSum([this.seconds, this.nanoseconds], process.hrtime()));
		}
		// console.log('STARTED', [this.seconds, this.nanoseconds]);
		return this;
	}
	stop() {
		// console.log('STOP', [this.seconds, this.nanoseconds]);
		if (this.seconds > 0) {
			([
				this.seconds,
				this.nanoseconds
			] = hrSum([this.seconds, this.nanoseconds], process.hrtime(), true));
		}
		// console.log('STOPPED', [this.seconds, this.nanoseconds]);
		return this;
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
	return Object.values(timers).find(({ name }) => (name === findName));
}
function getTimer(idOrName) {
	if (typeof idOrName === 'string') {
		return getByName(idOrName);
	} else if (typeof idOrName === 'number') {
		return timers[idOrName];
	} else { return undefined; }
}
function newTimer(name, hrTimer = false) {
	const index = ++globalIndex;
	const timer = (hrTimer ? new HRTimer(index, name) : new Timer(index, name));
	timers[index] = timer;
	return timer;
}
function start(idOrName, createIfMissing = true) {
	var timer;
	if (idOrName) timer = getTimer(idOrName);
	if (!timer) {
		if (typeof idOrName === 'number') return false;
		if (createIfMissing) {
			timer = newTimer(idOrName, createIfMissing === 'hr');
		} else {
			return false;
		}
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
		return false;
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
	Timer,
	HRTimer,
	get: getTimer,
	new: newTimer,
	start,
	stop,
	valueOf,
	resolve
};
