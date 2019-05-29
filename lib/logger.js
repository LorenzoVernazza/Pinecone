process.env.FORCE_COLOR = 1;

const chalk = require('chalk');
const ctx = new chalk.constructor({ level: 1, enabled: true });
const util = require('util');
const { levels, defaults } = require('../config');
const Secret = require('./classes/Secret');
const Levels = require('./classes/Levels');
const Timers = require('./classes/Timer');

const {
	formatDate,
	transformText
} = require('./utils');

class BR {
	constructor(){
		this.toString = () => ('\n - ');
	}
}

/**
 * Prints stuff, creates logs.
 */
class Lumberjack {
	constructor(levels, options = {}) {
		const {
			name,
			nameColor,
			colorObjects,
			inspectDepth,
			inspectAll,
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
		} = options;

		this.levels = levels;

		this.name = name; // logger name
		this.nameColor = nameColor;
		this.nameTransform = nameTransform;

		this.dateFormat = dateFormat;

		this.separator = typeof separator === 'string' ? separator : defaults.separator;

		this.colorObjects = (colorObjects === 'true' || colorObjects === true);
		this.inspectDepth = inspectDepth;
		this.inspectAll = inspectAll;

		this.maxLevel = this.levels.get(level);
		if (this.maxLevel === undefined) this.maxLevel = this.levels.maxLevel;

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
	inspect(element, options = {}) {
		return util.inspect(element, { colors: (this.colorObjects === 'true' || this.colorObjects === true), depth: this.inspectDepth, ...options });
	}
	parse({
		index,
		color = 'white'
	}, value) {
		var line = '';
		const stringify = (element) => {
			if (element instanceof BR) {
				line += '\n';
				if (index !== null) {
					line += ctx[color](' ' + this.separator);
				}
			} else if (typeof element !== 'string') {
				if (!this.inspectAll && typeof element === 'object' && element.hasOwnProperty('toString')) line += ' ' + element.toString();
				else line += ' ' + this.inspect(element);
			} else {
				line += ' ' + String(element).replace(/^\n - /, '\n ' + ctx[color](this.separator) + ' ');
			}
		};
		value.forEach((element) => {
			if (element !== null && element !== undefined) {
				if (element instanceof Secret) {
					if (this.levels.values[element.level] > this.maxLevel) {
						line += ' ' + element.masked;
					} else {
						stringify(element.value);
					}
				} else {
					stringify(element);
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
			const name = transformText(this.nameTransform, this.name + (emitter ? '/' + emitter : ''));
			if (this.nameColor) {
				return ctx[this.nameColor](name);
			} else {
				return name;
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
		options = { ...defaults, ...options };

		this.levels = levels.filter(({ level }) => (!!level));
		this.levs = new Levels(levels);

		this.colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'gray', 'white'];

		this.printer = new Lumberjack(
			this.levs,
			options
		);

		this.logger = new Logger(this.printer.emit, this.levels, {
			timers: {
				value: Timers,
				writable: false
			},
			color: {
				value: (color, value) => {
					return ctx[color](value);
				}
			},
			colors: {
				value: this.colors,
				writable: false
			},
			br: {
				get() { return new BR(); }
			},
			secret: {
				value: (value, {
					mask = options.secretMask,
					level = options.secretLevel,
					maxLength = options.secretMaxLength
				} = {
					mask: options.secretMask,
					level: options.secretLevel,
					maxLength: options.secretMaxLength
				}) => {
					const hidden = this.levs.get(level) > this.printer.maxLevel;
					return new Secret(value, {
						mask,
						level,
						hidden,
						maxLength
					});
				},
				writable: false
			},
			inspect: this.printer.inspect
		});
		this.logger.new = (configuration) => { return new LoggerCreator({ ...options, ...configuration }).logger; };
	}
}

var myLogger = new LoggerCreator({});
module.exports = myLogger.logger;
