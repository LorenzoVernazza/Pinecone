/* eslint-disable no-console */
const Stream = require('stream');

const { levels, defaults: defaultOpts, colors } = require('../../config');
const {	isTrue, inspect, colorize } = require('../utils');

const BR = require('../classes/BR');
const Ellipsis = require('../classes/Ellipsis');
const Group = require('../classes/Group');
const LevelsContructor = require('../classes/Levels');
const Secret = require('../classes/Secret');
const Timers = require('../classes/Timers');
const Title = require('../classes/Title');
const Package = require('../classes/Package');

const Carpenter = require('./Carpenter');
const Sawmill = require('./Sawmill');

const levelsHandler = new LevelsContructor(levels.filter(({ level }) => (!!level)));
var idCounter = 1;

function loadOutput(output, err = false) {
	if (output === false || output === null) {
		return { write: () => {} };
	} else if (output === 'stdout') {
		return process.stdout;
	} else if (output === 'stderr') {
		return process.stderr;
	} else if (output === 'console') {
		return { write: err ? console.error : console.log };
	} else if (typeof output === 'function') {
		return { write: output };
	} else if (output instanceof Stream || (typeof output === 'object' && output.write && typeof output.write === 'function')) {
		return output;
	} else {
		return err ? process.stderr : process.stdout;
	}
}

function loadLevels(options, emitter = '') {
	const {
		stderr, // precedence
		stdout, // precedence
		output,
		level: maxLevel,
		noLog = false,
		type = 'string', // json, string
		disableColors = false
	} = options;
	if (stderr !== undefined || stdout !== undefined) {
		this.stderr = loadOutput(stderr, true);
		this.stdout = loadOutput(stdout);
	} else {
		this.stderr = loadOutput(output, true);
		this.stdout = loadOutput(output);
	}
	const sawmill = new Sawmill(options, levelsHandler);
	const carpenter = new Carpenter(options);

	const buildFunction = type === 'json' && !(this.stderr instanceof Stream || this.stdout instanceof Stream) ? carpenter.buildJSONLog : carpenter.builStringLog;
	const getLogFunction = (value, level) => {
		const line = sawmill.process(value, level);
		return buildFunction(line, level, emitter);
	};
	if (noLog) {
		this.log = () => {};
	} else {
		this.log = async (...value) => this.stdout.write(getLogFunction(value, {
			level: null,
			color: null,
			index: -1
		}));
	}
	levels.forEach(({ level, color, error }, index) => {
		const levelObj = {
			level,
			color: disableColors ? false : color,
			error,
			index
		};
		if (index <= maxLevel) {
			if (levelObj.error) {
				this[level] = async (...value) => {
					this.stderr.write(getLogFunction(value, levelObj));
				};
			} else {
				this[level] = async (...value) => {
					this.stdout.write(getLogFunction(value, levelObj));
				};
			}
		} else {
			this[level] = () => {};
		}
	});
}

function loadOptions(newOptions, oldOptions) {
	const _opts = { ...defaultOpts, ...oldOptions, ...newOptions };
	_opts.mode = ['sync','async'].indexOf(_opts.mode) !== -1 ? _opts.mode : 'async';

	_opts.disableColors = isTrue(_opts.disableColors);
	_opts.inspectAll = isTrue(_opts.inspectAll);
	_opts.showDate = isTrue(_opts.showDate);
	_opts.showLevel = isTrue(_opts.showLevel);
	_opts.showName = isTrue(_opts.showName);

	const level = _opts.level;
	_opts.level = (level === -1 || level === 'silent') ? level : levelsHandler.get(level);
	if (_opts.level === undefined) _opts.level = levelsHandler.maxLevel;

	const secretLevel = levelsHandler.get(_opts.secretLevel);
	_opts.secretLevel = (secretLevel === undefined) ? levelsHandler.maxLevel : secretLevel;

	return _opts;
}

class Interface {
	constructor(options = {}) {
		var _opts = {};
		var _emitters = {};
		Object.defineProperty(this, 'seed', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: 'seed-' + (idCounter++)
		});
		this.apply = (newOptions) => {
			_opts = loadOptions(newOptions, _opts);
			loadLevels.call(this, _opts);
			this.inspect = inspect.bind({
				colors: !_opts.disableColors && _opts.colorObjects,
				depth: _opts.depth
			});
			this.ellipsis = (new Ellipsis(_opts.ellipsisAt)).trim;
			this.secret = (value, {
				mask = _opts.secretMask,
				level = _opts.secretLevel,
				maxLength = _opts.secretMaxLength
			} = {
				mask: _opts.secretMask,
				level: _opts.secretLevel,
				maxLength: _opts.secretMaxLength
			}) => {
				const hidden = levelsHandler.get(level) > _opts.level;
				return new Secret(value, {
					mask,
					level,
					hidden,
					maxLength
				});
			};
			this.new = (_options) => {
				const { transporters, ...rest } = _opts;
				return new Interface({ ...rest, ..._options });
			};
			this.newGroup = (...members) => new Group({
				inspect: this.inspect,
				ellipsis: this.ellipsis,
				secret: this.secret,
				color: colorize,
				title: Title,
				timers: Timers
			}, levels, this, members);
			for (const emitter of Object.keys(_emitters)) {
				loadLevels.call(_emitters[emitter], _opts, emitter);
			}
			Object.seal(this);
			return this;
		};
		this.emitter = (name = 'emitter') => {
			if (!_emitters[name]) {
				const emitter = {};
				loadLevels.call(emitter, _opts, name);
				_emitters[name] = emitter;
			}
			return _emitters[name];
		};
		this.package = Package;
		this.color = colorize;
		this.title = Title;
		this.timers = Timers;
		Object.defineProperty(this, 'level', {
			get: () => (_opts.level.name)
		});
		Object.defineProperty(this, '_opts', {
			get: () => (_opts)
		});
		this.apply(options);
	}
	get br() {
		return new BR();
	}
}

module.exports = Interface;
