
/** Format date to UTC, ISO, millis or uses moment for custom patterns. */
function formatDate(/** Format type, can be UTC, ISO, millis or a moment format string. */format?: 'UTC' | 'ISO' | 'millis' | string, /** Date to format, defaults to now. */date?: Date): string;

/** Transform text to uppercase or lowercase. */
function transformText(/** Tranformation type. */tranformation: 'uppercase' | 'lowecase' | false, /** Value to transform */value?: string): string;

export {
    formatDate,
    transformText
}