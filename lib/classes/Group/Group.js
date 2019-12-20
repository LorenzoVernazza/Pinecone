// const Interface = require('../../main/Interface');
class Group {
	constructor(methods, levels, leader, members = []) {
		Object.defineProperty(this, 'leader', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: leader
		});
		this.members = members;
		for (const [name, method] of Object.entries(methods)) {
			this[name] = method;
		}
		for (const { level } of levels) {
			this[level] = (...value) => {
				this.leader[level](...value);
				for (const member of this.members) {
					member[level](...value);
				}
			};
		}
		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);
		Object.seal(this);
	}
	add(logger) {
		if (logger.seed) {
			this.members.push(logger);
			return (this.members.length - 1);
		} else {
			return false;
		}
	}
	remove(logger = this.members.length - 1) {
		switch (typeof logger) {
			case 'number':
				return !!(this.members.splice(logger, 1)).length;
			case 'string':
				return !!(this.members.splice(this.members.findIndex(({ seed }) => (seed === logger)), 1)).length;
			case 'object':
				return !!(logger.seed && (this.members.splice(this.members.findIndex(({ seed }) => (seed === logger.seed)), 1)).length);
			default: return false;
		}
	}
}

module.exports = Group;
