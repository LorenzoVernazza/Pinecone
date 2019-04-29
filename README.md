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

```javascript
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
