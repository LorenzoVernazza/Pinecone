const BR = require('../classes/BR');
const NSP = require('../classes/NSP');
const Ellipsis = require('../classes/Ellipsis');
const { Secret, SecretArray } = require('../classes/Secret');
const { inspect, colorize } = require('../utils');

class Sawmill {
	constructor(options, levelsHandler) {
		this.inspectAll = options.inspectAll;
		this.separator = options.separator;
		this.ellipsis = (new Ellipsis(options.maxLength)).trim;
		this.inspect = inspect.bind({
			colors: !options.disableColors && options.colorObjects,
			depth: options.depth
		});
		this.mode = options.mode;
		this.maxLevel = options.level;
		this.levelsHandler = levelsHandler;
		this.stringify = this.stringify.bind(this);
		this.process = this.process.bind(this);
	}
	stringify(element, { index, color }, space = ' ') {
		let line = '';
		if (element instanceof BR) {
			line += '\n';
			if (index !== null) {
				line += ' ' + colorize(this.separator, color);
			}
		} else if (typeof element !== 'string') {
			if (!this.inspectAll && typeof element === 'object' && element.hasOwnProperty('toString')) line += space + element.toString();
			else line += space + this.inspect(element);
		} else {
			line += space + String(element).replace(/^\n - /, '\n ' + colorize(this.separator, color) + ' ');
		}
		return this.ellipsis(line);
	}
	process(value, level = {}) {
		var line = '';
		let space = '';
		value.forEach((element) => {
			if (element !== null && element !== undefined) {
				if (element instanceof NSP) {
					space = '';
				} else {
					if (element instanceof Secret) { // this.levelsHandler.values[element.level]
						if (element.level.value > this.maxLevel) {
							line += space + element.masked;
						} else {
							line += this.stringify(element.value, level, space);
						}
					} else if (element instanceof SecretArray) {
						for (const _element of element) {
							if (_element.value instanceof NSP) {
								space = '';
							} else {
								if (_element.level.value > this.maxLevel) {
									line += space + _element.masked;
								} else {
									line += this.stringify(_element.value, level, space);
								}
								space = ' ';
							}
						}
					} else {
						line += this.stringify(element, level, space);
					}
					space = ' ';
				}
			}
		});
		return line;
	}
}

module.exports = Sawmill;
