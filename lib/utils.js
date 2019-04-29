module.exports = {
	formatDate(format = 'UTC', date = new Date()) {
		switch (format) {
			case 'utc':
			case 'UTC': return date.toUTCString();

			case 'iso':
			case 'ISO': return date.toISOString();

			case 'millis': return date.getTime();

			default:
				var moment;
				try {
					moment = require('moment');
				} catch (e) {
					throw Error('Cannot find module "moment", "moment" is required for custom date formatting. Try running "npm install moment".');
				}
				return moment(date).format(format);
		}
	},
	transformText(tranformation, value = '') {
		if (tranformation === 'uppercase') return value.toUpperCase();
		else if (tranformation === 'lowercase') return value.toLowerCase();
		else return value;
	}
};
