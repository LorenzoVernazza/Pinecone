const timers = {};
var globalIndex = 0;

/**
 * Converts milliseconds to a human-readable string.
 */
function prettify(/** Time in milliseconds */time: number): string;

/**
 * Timer class. Represents a timer with start, stop and resolve methods.
 */
declare class Timer {
	/** Timer stored value. */
	value: { pretty: string } | number;
	/** Timer start date (millis). */
	time: number;
	/** Timer id. */
	id: number;
	constructor(/** Timer id. */id: number, /** Timer name. */name?: string);
	/** Timer id. */
	get id(): number;
	/** Starts the timer. */
	start(): void;
	/** Stops the timer. */
	stop(): void;
	/** Resolves the timer: deletes timer and returns value. */
	resolve(): { pretty: string } | number;
	/** Returns Timer id. */
	toString() {
		return this.id;
	}
}

/**
 * Finds Timer by name.
 */
function getByName(/** Timer name. */findName: string): Timer | undefined;
/**
 * Finds Timer by name or id.
 */
function getTimer(/** Timer name or id. */idOrName: string | number): Timer | undefined;
/**
 * Creates new timer.
 */
function newTimer(/** Timer name. */name?: string): Timer;
/**
 * Finds and starts a timer.
 */
function start(/** Timer name or id. */idOrName: string | number): void;
/**
 * Finds and stops a timer.
 */
function stop(/** Timer name or id. */idOrName: string | number): void;
/**
 * Finds and resolves a timer.
 */
function resolve(/** Timer name or id. */idOrName: string | number): { pretty: string } | number;
/**
 * Finds and returns the value of a timer.
 */
function valueOf(/** Timer name or id. */idOrName: string | number): { pretty: string } | number;

export = {
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