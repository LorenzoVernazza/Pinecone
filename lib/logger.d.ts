import { Stream } from "stream";

type Separator = Symbol;
type Color = 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'grey' | 'white';
type Level = 'fatal' | 'error' | 'warn' | 'success' | 'info' | 'debug' | 'trace';

declare class Logger {
    /** Provides a separator for multi-line logs. */
    br: Separator;

    /** Returns a colored string. */
    color(/** Output color. */ color: Color, /** Input string. */ value: string): string;

    /** Returns available colors. */
    colors: string[];

    /** Hides a string if the logger level is too low. */
    secret(/** String to mask. */value: string, /** Replacement char, default *. */replacement?: string, /** Level required. */level?: Level): object;
 
    /** Creates a new logger instance. */
    new(
        /** New logger options. */
        options: {
            /** Name of the logger. */
            name?: string,
            /** Color oth the logger name. */
            nameColor?: Color,
            /** Transformation of the logger name. */
            nameTransform?: "uppercase" | "lowercase" | false,
            /** Enable/Disable inspect object coloration. */
            colorObjects?: boolean,
            /** Inspect depth. */
            inspectDepth?: number,
            /** Maximum log level printed. */
            level?: Level,
            /** Shows/Hides logger name from logs. */
            showName?: boolean,
            /** Shows/Hides log level from logs. */
            showLevel?: boolean,
            /** Shows/Hides log date from logs. */
            showDate?: boolean,
            /** Log date format. Requires moment for custom formats. */
            dateFormat?: "UTC" | "ISO" | "millis" | string,
            /** Default separator for log infos and new lines. */
            separator?: string,
            /** Standard output. */
            stdout?: Stream.writable,
            /** Standard error. */
            stderr?: Stream.writable
            /** Use async calls. */
            async?: boolean,
            /** Replacement char for secrets, default *. */
            secretReplacement,
            /** Required level for secrets, default "debug". */
            secretLevel
        }
    ): Logger;

    /** Prints a log to stdout. */
    log(/** Value to print. */value: any): void;
    
    /** Logger constructor, applies levels. */
	constructor(printFunction: function, levels: object[], others: object);
}

const myLogger = new Logger();
export = myLogger;
