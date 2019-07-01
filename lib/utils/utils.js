const util = require('util');
const chalk = require('chalk');
const ctx = new chalk.constructor({ level: 1, enabled: true });

/** Format date to UTC, ISO, millis or uses moment for custom patterns. */
function formatDate(format = 'UTC', date = new Date()) {
	switch (format) {
		case 'utc':
		case 'UTC': return date.toUTCString();
		case 'iso':
		case 'ISO': return date.toISOString();
		case 'millis': return date.getTime();
		default:
			// check for moment
			var moment;
			try {
				moment = require('moment');
			} catch (e) {
				throw Error('Cannot find module "moment", "moment" is required for custom date formatting. Try running "npm install moment".');
			}
			return moment(date).format(format);
	}
}
/** Transform text to uppercase or lowercase. */
function transformText(tranformation = '', value = '') {
	if (tranformation === 'uppercase') return value.toUpperCase();
	else if (tranformation === 'lowercase') return value.toLowerCase();
	else return value;
}
/** Checks if input is equal to boolean or string true. */
function isTrue(value) {
	return value === true || value === 'true';
}
/** Checks if input is equal to boolean or string false. */
function isFalse(value) {
	return value === false || value === 'false';
}
/** Inspect, wraps util.inspect. */
function inspect(element, options = {}) {
	return util.inspect(element, { colors: isTrue(this.options && this.options.colorObjects), depth: this.options && this.options.inspectDepth, ...options });
}
/** Colorize text. */
function colorize(input = '', color = 'white'){
	return color ? ctx[color](input) : input;
}

module.exports = {
	formatDate,
	transformText,
	isTrue,
	isFalse,
	inspect,
	colorize
};
