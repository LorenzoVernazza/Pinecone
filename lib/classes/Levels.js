class Level {
	constructor({ name, value, color, error }){
		this.name = name;
		this.value = value;
		this.color = color;
		this.error = error;
	}
	toString(){
		return this.value;
	}
}

class Levels {
	constructor(levels) {
		this.values = {};
		this.names = [];
		levels.filter(({ level }) => (!!level)).forEach(({ level, color, error }, index) => {
			this.names.push(level);
			this.values[level] = new Level({
				color,
				error: !!error,
				value: index,
				name: level
			});
		});
	}
	toString() {
		Object.keys(this.values).join(', ');
	}
	get length() {
		return this.names.length;
	}
	get maxLevel() {
		return this.names[this.names.length - 1];
	}
}

module.exports = Levels;
