import { Color } from '../types';

type InspectOptions = {
    /** Color objects. */
    colors: boolean,
    /** Depth of inspection. */
    depth: number
}

/** Format date to UTC, ISO, millis or uses moment for custom patterns. */
function formatDate(/** Format type, can be UTC, ISO, millis or a moment format string. */format?: 'UTC' | 'ISO' | 'millis' | string, /** Date to format, defaults to now. */date?: Date): string;

/** Transform text to uppercase or lowercase. */
function transformText(/** Tranformation type. */tranformation: 'uppercase' | 'lowecase' | false, /** Value to transform */value?: string): string;

/** Checks if input is equal to boolean or string true. */
function isTrue(/** Input to check. */input: any): boolean;

/** Checks if input is equal to boolean or string false. */
function isFalse(/** Input to check. */input: any): boolean;

/** Inspect, wraps util.inspect. */
function inspect(/** Element to inspect. */element, options: InspectOptions): string;
    
/** Colorize text. */
function colorize(/** Input to color. */input: string, /** Color to use. */color: Color): string;

/** Pads a string. */
function padString(/** String to pad. */input: string, /** Number of chars to add. */number: number, /** Char to fill with. */fill: string, /** Pads from start instead of end. */start: boolean): string;

export = {
    formatDate,
    transformText,
    isTrue,
    isFalse,
    inspect,
    colorize,
    padString
}