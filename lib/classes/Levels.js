/**
 * Represents a log level.
 */
class Level {
	constructor({
		name,
		value,
		color,
		error
	}){
		this.name = name;
		this.value = value;
		this.color = color;
		this.error = error;
	}
	/** Overrides default method. */
	toString(){
		return this.value;
	}
}

/**
 * Collection of log levels.
 */
class Levels {
	constructor(levels) {
		this.values = {};
		this.names = [];
		levels.filter(({ level }) => (!!level)).forEach(({ level, color, error }, index) => {
			if (this.names.indexOf(level) === -1) {
				this.names.push(level);
				this.values[level] = new Level({
					color,
					error: !!error,
					value: index,
					name: level
				});
			}
		});
	}
	toString() {
		Object.keys(this.values).join(', ');
	}
	get length() {
		return this.names.length;
	}
	get maxLevel() {
		return this.names.length - 1;
	}
	get(level) {
		if (level && this.values[level]) {
			return this.values[level];
		} else if (level > -1 && level < this.length) {
			return this.values[this.names[level]];
		} else {
			return undefined;
		}
	}
}

module.exports = Levels;
