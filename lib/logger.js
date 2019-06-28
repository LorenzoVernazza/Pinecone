class Carpenter {
	constructor(options = {}) {
		options = {...defaultOptions, ...options};
	}
	buildLog(line, level, emitter){
		if (level) {
			const dateString = ctx[color](this.buildDate());
			const levelString = ctx[color](this.buildLevel(level));
			const nameString = this.buildName(emitter);
			return (
				dateString + (dateString ? ' ' : '') +
				levelString + (levelString ? ' ' : '') +
				nameString + (nameString ? ' ' : '') +
				ctx[color](this.separator) + line + ' \n'
			);
		} else {
			return line + ' \n';
		}
	}
}
