/**
 * Represents a secret.
 */
class Secret {
	constructor(value, {
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
	toString() {
		return this.hidden ? this.masked : this.value.toString();
	}
}

/**
 * Represents an array of secrets.
 */
class SecretArray extends Array {
	constructor(...props) {
		super(...props);
	}
	add(value, options) {
		this.push(new Secret(value, options));
	}
	toString() {
		let res = '';
		for (const secret of this) {
			const string = secret.toString();
			if (res && string) res += ' ';
			res += string;
		}
		return res;
	}
}

module.exports = {
	Secret,
	SecretArray
};
