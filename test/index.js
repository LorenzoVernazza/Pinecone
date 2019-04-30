const logger = require('..').new({ name: 'traceLogger', level: 'trace' });
const infoLogger = require('..').new({ name: 'infoLogger', level: 'info' });

logger.log('Hello world!', logger.br, 'This is just a runtime log!\n');
logger.fatal('Fatal log!');
logger.error('Error log!');
logger.warn('Warn log!');
logger.success('Success log!');
logger.info('Info log!');
logger.debug('Debug log!');
logger.trace('Trace log!');
logger.log();

const loggerEmitter = logger.emitter('testEmitter');
loggerEmitter.success('Hello world!', logger.br, 'I am an emitter for traceLogger!');
logger.log();

logger.info('I log up to "trace" so this secret is clear:', logger.secret('some secret'));
loggerEmitter.info('I inherit my father\'s options so also this secret is clear:', logger.secret('some secret'));
infoLogger.info('I instead log up to "info" so this secret is masked:', infoLogger.secret('some secret'));
infoLogger.debug('And since i log up to "info" this will never print!');
