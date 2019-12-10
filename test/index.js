/* eslint-disable no-console */
const logger = require('..').apply({ name: 'traceLogger', level: 'trace' });
const infoLogger = require('..').new({ name: 'infoLogger', level: 'info' });
const testObject = {
	value: 'I\'m an object!'
};

logger.log('Hello world!', logger.br, 'This is ju', logger.nsp, 'st a runtime log!\n');
logger.fatal('Fatal log!');
logger.error('Error log!');
logger.warn('Warn log!');
logger.success('Success log!');
logger.info('Info log!');
logger.debug('Debug log!');
logger.trace('Trace log!');
logger.log();

logger.log('Package informations:', logger.package.version, logger.package('version'), logger.package.name);
logger.package.unload();

const loggerEmitter = logger.emitter('testEmitter'); // emitter
loggerEmitter.success('Hello world!', logger.br, 'I am an emitter for traceLogger!'); // emitter
logger.warn(logger.title(['I\'m a title!', '', 'Now testing .apply() and loggers hierarchy.'], { color: 'cyan', frameColor: 'magenta' }));
logger.apply({ disableColors: true });
const sadLogger = require('..').new({ name: 'sadLogger', level: 'info' });
logger.info('Colors have been disabled.', testObject);
loggerEmitter.info('I inherit my father\'s options so Colors have been disabled for me too.', testObject);
sadLogger.info('Colors have been disabled for me too since i was created after.', testObject);
infoLogger.info('Colors have not been disabled for me since i was created before.', testObject);
logger.apply({ disableColors: false });
logger.info('Colors have been restored.', testObject);
loggerEmitter.info('Colors have been restored for me too.', testObject);
sadLogger.info('Colors are still disabled for me.', testObject);
infoLogger.info('Colors are still enabled for me.', testObject);
logger.log();
logger.warn(logger.title(['I\'m a centered title with type 1, char "=" and sideChar "||"!', '', 'Now testing Secrets.'], { color: 'cyan', frameColor: 'magenta', char: '=', type: 1, align: 'center', sideChar: '||', side: 0 }));

logger.info('I log up to "trace" so this secret is clear:', logger.secret('some secret'));
logger.info('I even work with objects:', logger.secret(logger.br + 'Test:'), logger.secret(testObject));

infoLogger.info('I instead log up to "info" so this secret is masked:', infoLogger.secret('some secret'));
infoLogger.info('This is the same secret but has max length of 4:', infoLogger.secret('some secret', {
	maxLength: 4
}));
infoLogger.info('And I even work with objects too:', logger.secret(testObject));

infoLogger.info('Even if this secret is generated by another logger should still be masked:', logger.secret('some secret'));
infoLogger.info('String contatenation resolves the secret immediatly, this should be hidden: ' + infoLogger.secret('some secret'));
infoLogger.info('And this shouldn\'t: ' + logger.secret('some secret'));
infoLogger.debug('And since i log up to "info" this will never print!');
const iterableSecret = logger.secret([logger.br, 'This is an iter', logger.nsp, 'able secret.', logger.br, 'Cool!'], { iterable: true, mask: '' });
const iterableSecretSpread = logger.secret([logger.br, 'This is also an iter', logger.nsp, 'able secret, but uses a spread operator.'], { iterable: true, mask: '' });
infoLogger.info('Iterable secret, but i log up to "info", so it should be empty:', iterableSecret, ...iterableSecretSpread);
logger.info('Iterable secret, this should show:', iterableSecret, ...iterableSecretSpread);
console.log('I\'m a console, and i can also use iterable secrets:' + iterableSecret, ...iterableSecretSpread.map((secret) => secret.toString()));

logger.log();
const maxLengthLogger = logger.new({ name: 'maxLengthLogger', maxLength: 30 });
logger.success('Ellipsis:',
	logger.br, logger.ellipsis('Testing ellipsis, max 100 chars.', 100),
	logger.br, logger.ellipsis('Testing ellipsis, max 10 chars.', 10, '....'),
	logger.br, logger.ellipsis('1234567890', 6),
	logger.br, logger.ellipsis('1234567890', 6, ';')
);
maxLengthLogger.info('This logger has a max length of 30, longer logs will be trimmed.');

logger.log();
logger.warn(logger.title('Now testing Groups...', { color: 'cyan', frameColor: 'magenta', align: 'right', type: 1 }));

const loggerParent = logger.new({ name: 'GroupLeader', level: 'info' });
const loggerChild1 = logger.new({ name: 'GroupMember1', level: 'trace' });
const loggerChild2 = logger.new({ name: 'GroupMember2', level: 'info' });
const loggerChildJSON = logger.new({ name: 'GroupMember3', level: 'debug', type: 'json', output: (value) => { console.log(value); } });

loggerParent.info('I\'ll be the group leader, my level is', loggerParent.level);
loggerChild1.info('I\'ll be the group member 1, my level is', loggerChild1.level);
loggerChild2.info('I\'ll be the group member 2, my level is', loggerChild2.level);
loggerChildJSON.info('I\'ll be the group member 3, my level is', loggerChildJSON.level);
logger.log();
const loggerGroup = loggerParent.newGroup(loggerChild1);
loggerGroup.info('This is from a group, should be printed twice.');
loggerGroup.debug('This is also from a group, but should only be printed once from member 1.');
loggerGroup.add(loggerChild2);
loggerGroup.add(loggerChildJSON);
loggerGroup.success('New logger added to group.', 'This should be printed four times.');
loggerGroup.info('Testing secrets:', logger.secret('This should be hidden for leader and 2'));
loggerGroup.info('Testing secrets', logger.nsp, logger.secret(': This should show only for 1.', { mask: '.', level: 'trace', maxLength: 1 }));
loggerGroup.remove(loggerChildJSON);
loggerGroup.remove(loggerChild2);
loggerGroup.remove(0);
loggerGroup.warn('All members removed from group.', 'This should be printed once.');

logger.log();
logger.warn(logger.title(['I\'m a right-aligned title with type 2!', '', 'Now testing Timers.'], { color: 'cyan', frameColor: 'magenta', align: 'right', type: 2 }));

const obj1 = {
	prop: 'I\'m an object.'
};
const obj2 = {
	prop: 'I\'m an object.',
	toString() {
		return this.prop.replace('.', ' with overloaded toString().');
	}
};
logger.success('Standard object:', obj1);
logger.success('Overloaded object:', obj2);

const timer = logger.timers.start('timer1');
const hrTimer = logger.timers.start('hrtimer1', 'hr');

setTimeout(() => {
	const value = timer.value;
	const hrvalue = hrTimer.value;

	logger.log('Testing timers after 500ms:',
		logger.br, value.pretty + ' (' + value + 'ms).',
		logger.br, `${hrvalue.pretty} (${hrvalue.seconds}s ${hrvalue.nanoseconds}ns | ${hrvalue}ms).`
	);

	logger.log('Pausing timers for 200ms');
	timer.stop();
	hrTimer.stop();
	setTimeout(() => {
		logger.timers.start('timer1');
		logger.timers.start('hrtimer1');
	}, 200);
}, 500);

setTimeout(() => {
	const value = logger.timers.resolve(timer.toString());
	const hrvalue = logger.timers.resolve(hrTimer.toString());
	logger.log('Resolving timers after 1400ms, paused for 200ms:',
		logger.br, 'Timer:', value.pretty + ' (' + value + 'ms).',
		logger.br, `High Resolution Timer: ${hrvalue.pretty} (${hrvalue.seconds}s ${hrvalue.nanoseconds}ns | ${hrvalue}ms).`
	);
}, 1400);

const zerologger = require('..').new({ name: 'zerologger', level: 0 });
zerologger.info('I have a logger level of 0.');
zerologger.fatal('I have a logger level of 0.');
zerologger.log('I have a logger level of 0.');

const silentlogger = require('..').new({ name: 'silentlogger', level: 'silent' });
silentlogger.info('I have a logger level of -1.');
silentlogger.fatal('I have a logger level of -1.');
silentlogger.log('I have a logger level of -1.');

const negativelogger = require('..').new({ name: 'negativelogger', level: -2 });
negativelogger.info('I have a logger level of -2.');
negativelogger.fatal('I have a logger level of -2.');
negativelogger.log('I have a logger level of -2.');
