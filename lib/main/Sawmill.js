const BR = require('../classes/BR');
const Secret = require('../classes/Secret');
const { isTrue, inspect } = require('../utils');

class Sawmill {
    constructor(options){
        this.inspectAll = isTrue(options.inspectAll);
        this.separator = options.separator;
        this.inspect = inspect.bind(this);
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
        return line;
    };
    process(value, level = {}) {
		var line = '';
		value.forEach((element) => {
			if (element !== null && element !== undefined) {
				if (element instanceof Secret) {
					if (this.levels.values[element.level] > this.maxLevel) {
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