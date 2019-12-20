import { Color } from '../../types';

declare type TimerValue = {
	/** Values by time fractions. */values: object,
	/** Pretty prints values with default settings. */pretty: string,
	/** Pretty prints values with custom settings. */prettyPrint(
		/** Toggles *small* ('h') or *full* ('hours') units, default *small* (true). */small?: boolean,
		/** Digits color, default *null*. */digitsColor ?: Color,
		/** Units color, default *null*. */unitsColor ?: Color
	): string
} | string;

/**
 * Converts milliseconds to a human-readable string.
 */
function prettify(/** Time in milliseconds */time: number): string;

declare class Timer {
	/** Timer stored value. */
	value: TimerValue;
	/** Timer start date (millis). */
	time: number;
	/** Timer id. */
	id: number;
	constructor(/** Timer id. */id: number, /** Timer name. */name?: string);
	/** Timer id. */
	get id(): number;
	/** Starts the timer. */
	start(): Timer;
	/** Stops the timer. */
	stop(): Timer;
	/** Resolves the timer: deletes timer and returns value. */
	resolve(): TimerValue;
	/** Returns Timer id. */
	toString() {
		return this.id;
	}
}

declare class HRTimer {
	/** Timer stored value. */
	value: TimerValue;
	/** Timer start second. */
	seconds: number;
	/** Timer start nanosecond. */
	nanoseconds: number;
	/** Timer id. */
	id: number;
	constructor(/** Timer id. */id: number, /** Timer name. */name?: string);
	/** Timer id. */
	get id(): number;
	/** Starts the timer. */
	start(): Timer;
	/** Stops the timer. */
	stop(): Timer;
	/** Resolves the timer: deletes timer and returns value. */
	resolve(): TimerValue;
	/** Returns Timer id. */
	toString() {
		return this.id;
	}
}

/**
 * Finds Timer by name.
 */
function getByName(/** Timer name. */findName: string): Timer|HRTimer;
/**
 * Finds Timer by name or id.
 */
function getTimer(/** Timer name or id. */idOrName: string | number): Timer|HRTimer;
/**
 * Creates new timer.
 */
function newTimer(/** Timer name. */name?: string, /** High Resolution timer. */hrTimer?: falsr): Timer;
/**
 * Creates new high resolution timer.
 */
function newTimer(/** Timer name. */name?: string, /** High Resolution timer. */hrTimer: true): HRTimer;
/**
 * Finds and starts a timer.
 */
function start(/** Timer name or id. */idOrName: string | number, /** Create timer if given name does not exist. Pass 'hr' for HR timer. */createIfMissing?: boolean | 'hr'): Timer|HRTimer;
/**
 * Finds and stops a timer.
 */
function stop(/** Timer name or id. */idOrName: string | number): boolean;
/**
 * Finds and resolves a timer.
 */
function resolve(/** Timer name or id. */idOrName: string | number): { pretty: string } | number;
/**
 * Finds and returns the value of a timer.
 */
function valueOf(/** Timer name or id. */idOrName: string | number): { pretty: string } | number;

export = {
	/**
	 * Timer class. Represents a timer with start, stop and resolve methods.
	 */
	Timer,
	/**
	 * Finds Timer by name or id.
	 */
	get: getTimer,
	/**
	 * Creates new timer.
	 */
	new: newTimer,
	/**
	 * Finds and starts a timer.
	 */
	start,
	/**
	 * Finds and stops a timer.
	 */
	stop,
	/**
	 * Finds and resolves a timer.
	 */
	resolve,
	/**
	 * Finds and returns the value of a timer.
	 */
	valueOf
};