process.env.FORCE_COLOR = 1;

const chalk = require('chalk');
const ctx = new chalk.constructor({ level: 1, enabled: true });

const util = require('util');

const { levels, defaults } = require('../config');

const Secret = require('./secrets');

// const timer = require('./lib/timer');

const {
	formatDate,
	transformText
} = require('./utils');

const BR = Symbol('br');

class Lumberjack {
	constructor(levels, options = {}) {
		const {
			name,
			nameColor,
			colorObjects,
			inspectDepth,
			level,
			showName,
			showLevel,
			showDate,
			dateFormat,
			separator,
			nameTransform,
			async,
			// output,
			stdout,
			stderr
		} = { ...defaults, ...options };

		this.levels = levels.map(({ level }) => (level));

		this.name = name; // logger name
		this.nameColor = nameColor;
		this.nameTransform = nameTransform;

		this.dateFormat = dateFormat;

		this.separator = typeof separator === 'string' ? separator : defaults.separator;

		this.colorObjects = (colorObjects === 'true' || colorObjects === true);
		this.inspectDepth = inspectDepth;

		if (level && this.levels.indexOf(level) > -1) {
			this.maxLevel = this.levels.indexOf(level);
		} else if (level > -1 && level < levels.length) {
			this.maxLevel = level;
		} else {
			this.maxLevel = this.levels.length - 1;
		}

		this.showDate = (showDate === 'true' || showDate === true);
		this.showLevel = (showLevel === 'true' || showLevel === true);
		this.showName = (showName === 'true' || showName === true);

		this.stdout = stdout || process.stdout;
		this.stderr = stderr || process.stderr;

		this.emitFunction = this.emitFunction.bind(this);
		this.emit = async ? async (opts, value) => {
			this.emitFunction(opts, value);
		} : this.emitFunction;
	}
	parse({
		index,
		level,
		color = 'white'
	}, value) {
		var line = '';
		value.forEach((element) => {
			if (element !== null && element !== undefined) {
				if (element === BR) {
					line += '\n';
					if (index !== null && element !== '') {
						line += ctx[color](' ' + this.separator);
					}
				} else if (element instanceof Secret) {
					line += ' ' + element.value.replace(/./g, '*');
				} else {
					if (typeof element !== 'string') {
						line += ' ' + util.inspect(element, { colors: this.colorObjects, depth: this.inspectDepth });
					} else {
						line += ' ' + String(element);
					}
				}
			}
		});
		return line;
	}
	build({ level, color = 'white', emitter }, line) {
		if (level) {
			const dateString = ctx[color](this.buildDate());
			const levelString = ctx[color](this.buildLevel(level));
			const nameString = this.buildName(emitter);
			return (
				dateString + (dateString ? ' ' : '') +
				levelString + (levelString ? ' ' : '') +
				nameString + (nameString ? ' ' : '') +
				ctx[color](this.separator) + line + ' \n'
			);
		} else {
			return line + ' \n';
		}
	}
	emitFunction(opts, value) {
		if ((opts.index <= this.maxLevel && opts.index > -1) || opts.level === null) {
			const line = this.parse(opts, value);
			if (opts.error) {
				if (this.stderr) this.stderr.write(this.build(opts, line));
			} else {
				if (this.stdout) this.stdout.write(this.build(opts, line));
			}
		}
	}
	buildName(emitter) {
		if (this.showName) {
			if (this.nameColor) {
				return ctx[this.nameColor](transformText(this.nameTransform, this.name + (emitter ? '/' + emitter : '')));
			} else {
				return (this.name + (emitter ? '/' + emitter : ''));
			}
		} else {
			return '';
		}
	}
	buildDate() {
		if (this.showDate) {
			return '[' + formatDate(this.dateFormat) + ']';
		} else {
			return '';
		}
	}
	buildLevel(level) {
		if (this.showLevel) {
			return '[' + level.toUpperCase() + ']';
		} else {
			return '';
		}
	}
}

class Logger {
	constructor(printFunction, levels, others = {}) {
		Object.defineProperties(this, others);

		const loadLevels = (root = this, emitter = '') => {
			Object.defineProperty(root, 'log', {
				writable: false,
				value: (...value) => {
					printFunction({
						level: null,
						emitter,
						custom: false
					}, value);
				}
			});
			levels.forEach(({ level, color, error }, index) => {
				Object.defineProperty(root, level, {
					writable: false,
					value: (...value) => {
						printFunction({
							index,
							level,
							color,
							error,
							emitter,
							custom: false
						}, value);
					}
				});
			});
			return root;
		};
		this.emitter = (emitter) => {
			return loadLevels({}, emitter);
		};
		loadLevels();
	}
}

class LoggerCreator {
	constructor(options) {
		this.levels = levels.filter(({ level }) => (!!level));
		this.colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'gray', 'white'];

		this.printer = new Lumberjack(
			this.levels,
			options
		);

		this.logger = new Logger(this.printer.emit, this.levels, {
			color: {
				value: (color, value) => {
					return ctx[color](value);
				}
			},
			colors: {
				value: this.colors,
				writable: false
			},
			// timer: {
			// 	value: timer
			// },
			br: {
				value: BR,
				writable: false
			},
			secret: {
				value: (arg) => (new Secret(arg)),
				writable: false
			}
		});

		this.logger.new = (configuration) => { return new LoggerCreator({ ...options, ...configuration }).logger; };
	}
}

var myLogger = new LoggerCreator({});
module.exports = myLogger.logger;
