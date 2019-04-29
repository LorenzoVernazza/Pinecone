const logger = require('..').new({ name: 'testLogger' });
logger.info('Hello world!');

const loggerEmitter = logger.emitter('testEmitter');

loggerEmitter.info('Hello world!');
loggerEmitter.fatal('Fatal error!');
logger.debug('This is a secret:', logger.secret('some secret'));
