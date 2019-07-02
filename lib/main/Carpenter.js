const {
	formatDate,
	transformText,
	colorize
} = require('../utils');

function emptyStringReturn() { return ''; };
function emptyJSONReturn() { return {}; };

class Carpenter {
	constructor(options = {}) {
		// options = {...defaultOptions, ...options};
		this.name = options.name;
		this.separator = options.separator;
		this.nameTransform = options.nameTransform;
		this.dateFormat = options.dateFormat;
		this.nameColor = options.nameColor;
		this.showDate = options.showDate;
		this.showLevel = options.showLevel;
		this.showName = options.showName;
		const load = (type) => {
			if (!this['show' + type]) {
				this['createString' + type] = emptyStringReturn;
				this['createJSON' + type] = emptyJSONReturn;
			}
		}
		for (const type of ['Date', 'Level', 'Name']) load(type);
		this.builStringLog = this.builStringLog.bind(this);
		this.buildJSONLog = this.buildJSONLog.bind(this);
	}
	// String
	createStringDate(date) {
		return '[' + formatDate(this.dateFormat, date) + '] ';
	}
	createStringLevel(level) {
		return '[' + level.toUpperCase() + '] ';
	}
	createStringName(emitter) {
		const name = transformText(this.nameTransform, this.name + (emitter ? '/' + emitter : '')) + ' ';
		return colorize(name, this.nameColor)
	}
	builStringLog(line, { level, color }, emitter = ''){
		if (level) {
			const dateString = colorize(this.createStringDate(), color);
			const levelString = colorize(this.createStringLevel(level), color);
			const nameString = this.createStringName(emitter);
			return (dateString + levelString + nameString + colorize(this.separator, color) + line + ' \n');
		} else {
			return line + ' \n';
		}
	}
	// JSON
	createJSONDate(date) {
		return { date: formatDate(this.dateFormat, date) };
	}
	createJSONLevel(level) {
		return { level: level ? level.toLowerCase() : null };
	}
	createJSONName(emitter) {
		return {
			...(emitter && {emitter}),
			name: this.name
		}
	}
	buildJSONLog(line, { level }, emitter = '') {
		return {
			value: line,
			...this.createJSONDate(),
			...this.createJSONLevel(level),
			...this.createJSONName(emitter)
		}
	}
};

module.exports = Carpenter;
