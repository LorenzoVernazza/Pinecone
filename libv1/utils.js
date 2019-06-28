module.exports = {
	/** Format date to UTC, ISO, millis or uses moment for custom patterns. */
	formatDate(format = 'UTC', date = new Date()) {
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
	},
	/** Transform text to uppercase or lowercase. */
	transformText(tranformation = '', value = '') {
		if (tranformation === 'uppercase') return value.toUpperCase();
		else if (tranformation === 'lowercase') return value.toLowerCase();
		else return value;
	}
};
