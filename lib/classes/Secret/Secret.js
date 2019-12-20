/**
 * Represents a secret.
 */
class Secret {
	constructor(value, process, {
		mask = '*',
		level = 'debug',
		hidden = true,
		maxLength
	}) {
		this.value = value;
		this.mask = mask;
		this.level = level;
		this.hidden = hidden;
		this.maxLength = maxLength;
		this.toString = () => (this.hidden ? this.masked : process([this.value], level));
	}
	get masked() {
		if (this.mask.length !== 1) {
			return this.mask;
		} else {
			const length = this.value.toString().length;
			return Buffer.alloc(
				this.maxLength > 0 ? Math.min(length, this.maxLength) : length,
				this.mask
			).toString();
		}
	}
}

/**
 * Represents an array of secrets.
 */
class SecretArray extends Array {
	constructor(process, level, ...props) {
		super(...props);
		this.toString = () => process(this, level);
		// const res = process(this, level);
		// for (const secret of this) {
		// 	const string = secret.toString();
		// 	if (res && string) res += ' ';
		// 	res += string;
		// }
	}
	add(value, process, options) {
		this.push(new Secret(value, process, options));
	}
}

module.exports = {
	Secret,
	SecretArray
};
