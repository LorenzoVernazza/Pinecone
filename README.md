# Pinecone Logger

Small and fast logger.

```javascript
const logger = require('pinecone-logger').new({ name: 'testLogger' });

logger.info('Hello world!'); //Outputs: "[<date>] [INFO] TESTLOGGER - Hello world!"
logger.log('Some standard log.'); //Outputs: "Some standard log."
```
### Levels

Levels can be customized with a 'levels' option passed to the logger.
Default levels are inspired by log4j levels.

| LEVEL | Color | Description |
| ------ | ------ | ------ |
| Fatal | Red BG | Severe errors that cause premature termination. |
| Error | Red | Other runtime errors or unexpected conditions. |
| Warn | Yellow | Use of deprecated APIs, poor use of API, 'almost' errors, other runtime situations that are undesirable or unexpected, but not necessarily "wrong". |
| Success | Green | Successful events, completion of long tasks. |
| Info | Cyan | Interesting runtime events (startup/shutdown). |
| Debug | Magenta | Detailed information on the flow through the system. |
| Trace | Blue | Most detailed information. |

### Options

Several options are available to customize the logger.

```js
const errLogger = require('pinecone-logger').new({ 
	name: 'errorLevelLogger',
	nameTransform: false,
	showDate: false,
	level: 'error' //same as 1
});

errLogger.info('Hello world!'); //Outputs nothing, "info" is higher than "error".
errLogger.error('Some error!'); //Outputs: "[ERROR] errorLevelLogger - Some error!"
```

| Option | Default | Description |
| ------ | ------ | ------ |
| level | "debug" | Maximum log level to process and print. |
| name | "" | Can be set to improve log readability. |
| nameColor | "grey" | Ansi color of the name. |
| nameTransform | "uppercase" | Tranforms the name to uppercase or lowercase. |
| dateFormat | "UTC" or "D MMM YYYY, HH:mm:ss.SSS Z" | Defines date format, requires "moment" for custom formats, only "UTC", "ISO" and "millis" are available otherwise. |
| separator | "-" | Separator to use between log informations and log value. |
| colorObjects | true | Enables standard utils.inpect() object coloration. |
| inspectDepth | 3 | Defines utils.inpect() depth. |
| showDate | true | Shows or hides date information. |
| showLevel | true | Shows or hides level information. |
| showName | true | Shows or hides name information. |
| stdout | process.stdout | Stdout stream, can be any writable stream or object with .write(chunk) method. |
| stderr | process.stderr | Stderr stream, can be any writable stream or object with .write(chunk) method. |
| async | true | Makes the logger async. |
| secretMask | "*" | Mask or Replacement Char for secrets, default *. |
| secretLevel | "debug" | Required level for secrets to be visible. |
| secretMaxLength | false | Limits the number of chars for masked secrets to improve readability. |

### Secrets

Secrets help hiding sensible information while in production.

```js
const infoLogger = require('pinecone-logger').new({ 
	name: 'infoLogger',
	level: 'info'
});	
const debugLogger = require('pinecone-logger').new({ 
	name: 'debugLogger',
	level: 'debug'
});
const user = "foo";
const password = "bar123!";
const secret = infoLogger.secret(password);

// When the secret is a single argument it is resolved while the log is processed by the logger.
infoLogger.info('User', user, 'logged in with password:', secret); //Outputs: "User foo logged in with password *******".
debugLogger.info('User', user, 'logged in with password:', secret); //Outputs: "User foo logged in with password bar123!".

// String concatenation resolves the secret before the processing instead, so, if logger level < secret level, secret will be masked.
infoLogger.info('User ' + user + ' logged in with password: ' + secret); //Outputs: "User foo logged in with password *******".
debugLogger.info('User ' + user + ' logged in with password: ' + secret); //Outputs: "User foo logged in with password *******".
console.log('User ' + user + ' logged in with password: ' + secret); //Outputs: "User foo logged in with password *******".
debugLogger.info('User ' + user + ' logged in with password: ' + debugLogger.secret(password)); //Outputs "User foo logged in with password bar123!" since both debugLogger and secret levels are "debug".
```

### Timers

Timers help visualizing how long is a given task. Timers are accessible from any logger from .timers property.

#### Logger .timers methods

| Method | Args | Description |
| ------ | --- | ------ |
| new() | name (string, optional) | Creates new timer. |
| get() | name (string) or id (number) | Finds Timer by name or id. |
| start() | name (string) or id (number) | Finds and starts a timer. |
| stop() | name (string) or id (number) | Finds and stops a timer. |
| resolve() | name (string) or id (number) | Finds and resolves a timer. |
| valueOf() | name (string) or id (number)| Finds and returns the value of a timer. |

#### Timer methods

| Property | Description |
| ------ | --- | ------ |
| id | Returns timer id. |
| value | Returns timer value. |

| Method | Description |
| ------ | --- | ------ |
| start() | Starts the timer. |
| stop() | Stops the timer. Can be resumed with "start()" |
| resolve() | Resolves the timer. |

By resolving a timer its value will be returned and the timer itself will be deleted. Use "value" and "valueOf" to access value without stopping or destroying the timer.

```js
const logger = require('pinecone-logger').new({ name: 'testLogger' });
const timer = logger.timers.start('timer1');

setTimeout(() => { // Waits 500ms
	const value = timer.value;
	logger.log('Testing timer after 500ms: ' + value.pretty + '(' + value + 'ms).'); 
	// Outputs "Testing timer after 500ms: 500ms (500ms).".
	logger.log('Pausing timer for 200ms');
	timer.stop(); // Stops timer.
	setTimeout(() => {
		logger.timers.start('timer1'); // Starts timer by name.
	}, 200);
}, 500);

setTimeout(() => { // Waits 1400ms
	const value = logger.timers.resolve(timer.toString()); // Resolves timer by id
	logger.log("Resolving timer after 1400ms, paused for 200ms: " + value.pretty + '(' + value + 'ms).');
	// Outputs "Resolving timer after 1400ms, paused for 200ms: 1s 200ms (1200ms).".
	// Timer counted only 1200ms as it was stopped for 200ms.
}, 1400);
```