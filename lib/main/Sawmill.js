const BR = require('../classes/BR');
const Ellipsis = require('../classes/Ellipsis');
const Secret = require('../classes/Secret');
const { inspect, colorize } = require('../utils');

class Sawmill {
	constructor(options, levelsHandler){
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
	stringify(element, { index, color }) {
		let line = '';
		if (element instanceof BR) {
			line += '\n';
			if (index !== null) {
				line += ' ' + colorize(this.separator, color);
			}
		} else if (typeof element !== 'string') {
			if (!this.inspectAll && typeof element === 'object' && element.hasOwnProperty('toString')) line += ' ' + element.toString();
			else line += ' ' + this.inspect(element);
		} else {
			line += ' ' + String(element).replace(/^\n - /, '\n ' + colorize(this.separator, color) + ' ');
		}
		return this.ellipsis(line);
	};
	process(value, level = {}) {
		var line = '';
		value.forEach((element) => {
			if (element !== null && element !== undefined) {
				if (element instanceof Secret) {
					if (this.levelsHandler.values[element.level] > this.maxLevel) {
						line += ' ' + element.masked;
					} else {
						line += this.stringify(element.value, level);
					}
				} else {
					line += this.stringify(element, level);
				}
			}
		});
		return line;
	}
}

module.exports = Sawmill;