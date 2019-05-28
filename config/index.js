exports.levels = [{
	level: 'fatal',
	color: 'bgRed',
	error: true
}, {
	level: 'error',
	color: 'red',
	error: true
}, {
	level: 'warn',
	color: 'yellow'
}, {
	level: 'success',
	color: 'green'
}, {
	level: 'info',
	color: 'cyan'
}, {
	level: 'debug',
	color: 'magenta'
}, {
	level: 'trace',
	color: 'blue'
}];

exports.defaults = {
	async: true,

	name: '',
	nameColor: 'grey',
	nameTransform: 'uppercase',

	dateFormat: 'D MMM YYYY, HH:mm:ss.SSS Z',

	separator: '-',

	colorObjects: 'true',
	inspectDepth: 3,
	inspectAll: false,
	level: process.env.PINECONE_LEVEL || 'debug',

	showDate: 'true',
	showLevel: 'true',
	showName: 'true',

	secretMask: '*',
	secretLevel: 'debug'
};
