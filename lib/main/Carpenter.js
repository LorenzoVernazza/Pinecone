const {
	formatDate,
	transformText,
	isTrue,
	colorize
} = require('../utils');

function emptyReturn() { return ''; };

function buildDate(date) {
	return '[' + formatDate(this.dateFormat, date) + '] ';
}
function buildLevel(level) {
	return '[' + level.toUpperCase() + '] ';
}
function buildName(emitter) {
	const name = transformText(this.nameTransform, this.name + (emitter ? '/' + emitter : '')) + ' ';
	return colorize(name, this.nameColor)
}
// function toHTML(value, element = 'span', style = false){
// 	const styleString = style && (Object.keys(style).length > 0) ? 'style=' + JSON.stringify() : ''
// 	return `<${element} ${styleString}>${value}</${element}>`
// }
class Stringifier {
	constructor(options = {}) {
		options = {...defaultOptions, ...options};
		const load = (type) => {
			if (!isTrue(options['show' + type])) {
				this['build' + type] = emptyReturn;
			// } else if (isTrue(options.HTMLFormat)) {
			} else {
				this['build' + type] = ['build' + type].bind(this);
			}
		}
		for (const type of ['Date', 'Level', 'Name']) load(type);
	}
	buildLog(line, level, emitter = '', color = 'white'){
		if (level) {
			const dateString = colorize(this.buildDate(), color);
			const levelString = colorize(this.buildLevel(level), color);
			const nameString = this.buildName(emitter);
			return (dateString + levelString + nameString + colorize(this.separator, color) + line + ' \n');
		} else {
			return line + ' \n';
		}
	}
}

class JSONizer {
	buildLog(line, level, emitter = '') {
		return {
			value: line,
			level,
			date: formatDate(this.dateFormat),
			emitter,
			name: this.name
		}
	}
}

class HTMLizer {

}