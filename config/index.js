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
	mode: process.env.PINECONE_MODE || 'async',

	name: process.env.PINECONE_DEFAULT_NAME || '',
	nameColor: process.env.PINECONE_NAME_COLOR || 'grey',
	nameTransform: process.env.PINECONE_NAME_TRANSFORM || 'uppercase',

	dateFormat: process.env.PINECONE_DATE_FORMAT || 'D MMM YYYY, HH:mm:ss.SSS Z',

	separator: process.env.PINECONE_SEPARATOR || '-',

	ellipsisAt: process.env.PINECONE_ELLIPSIS_AT || 64,
	maxLength: process.env.PINECONE_MAX_LOG_LENGTH || 0,

	disableColors: process.env.PINECONE_NO_COLORS || 'false',
	colorObjects: process.env.PINECONE_COLOR_OBJECTS || 'true',
	inspectDepth: process.env.PINECONE_INSPECT_DEPTH || 3,
	inspectAll: process.env.PINECONE_INSPECT_ALL || 'false',
	level: process.env.PINECONE_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

	showDate: process.env.PINECONE_SHOW_DATE || 'true',
	showLevel: process.env.PINECONE_SHOW_LEVEL || 'true',
	showName: process.env.PINECONE_SHOW_NAME || 'true',

	secretMask: process.env.PINECONE_SECRET_MASK || '*',
	secretLevel: process.env.PINECONE_SECRET_LEVEL || 'debug'
};

exports.colors = ['red', 'green', 'yellow', 'blue', 'cyan', 'magenta', 'gray', 'white'];
