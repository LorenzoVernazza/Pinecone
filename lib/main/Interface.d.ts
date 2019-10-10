import BR from '../classes/BR';
import Group from '../classes/Group';
import Secret from '../classes/Secret';
import Timers from '../classes/Timers';
import Package from '../classes/Package';
import Title from '../classes/Title';
import { inspect, colorize } from '../utils';
import { Stream } from 'stream';

declare type Level = 'fatal' | 'error' | 'warn' | 'success' | 'info' | 'debug' | 'trace';
declare type Color = false | 'red' | 'green' | 'yellow' | 'blue' | 'cyan' | 'magenta' | 'gray' | 'white' | 'black'  | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgCyan' | 'bgMagenta' | 'bgGray' | 'bgWhite' | 'bgBlack';
declare type LoggerOptions = {
    /** 
     * Maximum log level to process and print..
     * Default: "info" when NODE_ENV==production, "debug" otherwise.
     */
    level: Level,
    /** Can be set to improve log readability. */
    name: string,
    /** Ansi color of the name. Default: "grey". */
    nameColor: Color,
    /** Tranforms the name to uppercase or lowercase. Default: "uppercase". */
    nameTransform: false | "uppercase" | "lowercase",
    /** Defines date format, requires "moment" for custom formats, only "UTC", "ISO" and "millis" are available otherwise. Default: "D MMM YYYY, HH:mm:ss.SSS Z" if *moment* is present "UTC" otherwise. */
    dateFormat: "UTC" | "ISO" | "millis" | string,
    /** Separator to use between log informations and log value. Default "-". */
    separator: string,
    /** Enables standard utils.inpect() object coloration. Default: true. */
    colorObjects: boolean,
    /** Disables all colors. Default: false */
    disableColors: boolean,
    /** Defines *inpect()* calls depth. Default: 3. */
    inspectDepth: number,
    /** Shows or hides date information. Default: true. */
    showDate: boolean,
    /** Shows or hides level information. Default: true. */
    showLevel: boolean,
    /** Shows or hides name information. Default: true. */
    showName: boolean,
    /** Ellipsis default max length. Default: 64. */
    ellipsisAt: number,
    /** Max log length, if a log is longer ellipsis will be used, 0 = disabled. Default: 0. */
    maxLength: number,
    /** Offers a single output solution for both stdout and stderr, is ignored if any of stdout and stderr are defined. Default: null. */
    output: "console" | "stderr" | "stdout" | Stream | object | function | null,
    /** Stdout, can be any writable stream, function, a string ("console", "stderr", "stdout") or an object with .write(chunk: string|object) method. Default: process.stdout. */
    stdout: "console" | "stderr" | "stdout" | Stream | object | function | null,
    /** Stderr, can be any writable stream, function, a string ("console", "stderr", "stdout") or an object with .write(chunk: string|object) method. Default: process.stderr. */
    stderr: "console" | "stderr" | "stdout" | Stream | object | function | null,
    /** Disables .log() method outputs. Default: false. */
    noLog: boolean,
    /** Can be both "string" or "json", if json log will be sent to any output as a JSON object. Default: "string". */
    type: "string" | "json",
    /** Mask or Replacement Char for secrets. Default: "*". */
    secretMask: string,
    /** Required level for secrets to be visible. Default: "debug". */
    secretLevel: Level,
    /** Limits the number of chars for masked secrets to improve readability. Default: false. */
    secretMaxLength: number | false,
};
declare type TitleOptions = {
    /** Frame char. Default: "-" */
    char?: string;
    /** Type of title. Can be 0, 1 or 2. Default 0. */
    type?: 0 | 1 | 2;
    /** Text color. Default false. */
    color?: Color;
    /** Frame color. Default false. */
    frameColor?: false;
    /** Multi-line text alignment. Can be "rignt", "left" or "center". Default "left". */
    align?: 'left' | 'right' | 'center';
    /** Side char(s). Available only for type 1 and 2. Default "|" for type 1 and "/" for type 2 */
    sideChar?: string;
    /** Represents how many *char* will be placed in text-lines sides. Default 2. */
    side?: number;
};
declare type InspectOptions = {
    /** Use ansi colors. */
    colors: boolean,
    /** Inspect depth for objects. */
    depth: number
};
declare type SecretOptions = {
    /** 
     * Replacement char(s) for hidden secret. can be: 
     * - *Empty string* to remove hidden string completely.
     * - *Single char string* to replace each secret's char individually.
     * - *Multi char string* to replace all the secret at once.
     */
    mask?: string, 
    /** Level at wich the secret will be hidden. */
    level?: string,
    /** Limits the hidden secret's length when *mask* is single char. */
    maxLength?: number
};
/**
 * Log Emitter instance.
 */
declare class LogEmitter {
    /** Standard log, no additional data is printed. */
    log(...values: any): void;
    /** Severe errors that cause premature termination. Color: Red BG.  */
    fatal(...values: any): void;
    /** Runtime errors or unexpected conditions. Color: Red.  */
    error(...values: any): void;
    /** Use of deprecated APIs, poor use of API, 'almost' errors, other runtime situations that are undesirable or unexpected, but not necessarily "wrong". Color: Yellow.  */
    warn(...values: any): void;
    /** Successful events, completion of long tasks. Color: Green  */
    success(...values: any): void;
    /** Interesting runtime events (startup/shutdown). Color: Cyan.  */
    info(...values: any): void;
    /** Detailed information on the flow through the system. Color: Magenta.  */
    debug(...values: any): void;
    /** Most detailed information. Color: Blue.  */
    trace(...values: any): void;
}
/**
 * Logger instance.
 */
declare class Logger extends LogEmitter {
    constructor (options?: LoggerOptions)
    /** Applies new configurations to logger. Loggers created from this before the new config is applied won't be affected. */
    apply(/** Options to change. */newOptions: LoggerOptions): this;
    /** Trims down strings that are too long. */
    ellipsis(/** Input string */input: any, /** Maximum length, default 64. */length?: number, /** String replacement, default "...". */replacement?: string): string;
    /** Wrapper for utils.inspect(). */
    inspect(/** Element to inspect. */element: any, /** Inspect options. */options?: InspectOptions): string;
    /** Creates a new secret. */
    secret(/** Secret value. */value: any, /** Secret options */options?: SecretOptions): Secret;
    /** Creates a new logger. The new logger will inherit all of the parent's options. */
    new(/** Options to initialize the logger with. */options?: LoggerOptions): Logger;
    /** Creates a new logger group with *this* as leader. All the logger methods will be inherithed from the leader, all logs will be sent to the leader and each member. */
    newGroup(/** Members to initialize the group with. */...members): Group;
    /** Applies ansi colors to a string. */
    color(/** String to color. */input: string, /** Color to apply. */color: Color): string;
    /** Creates a new title. */
    title(/** Single-line title, use an array for multi-line titles. */title: string, /** Title options */options?: TitleOptions): string;
    title(/** Multi-line title, use a string for single-line titles. */title: string[], /** Title options */options?: TitleOptions): string;
    /** Creates a new emitter. An emitter inherits parent configurations, appends ots name to parent name and contains only log methods. */
    emitter(/** Emitter name, defaults as "emitter". */): LogEmitter;
    /** Create, delete, resolve timers. */
    timers = Timers;
    /** Retrieves informations from package.json. */
    package = Package;
    /** Add a new line to the log and a *separator* at the start of the new line. */
    br = new BR();
}

export = Logger