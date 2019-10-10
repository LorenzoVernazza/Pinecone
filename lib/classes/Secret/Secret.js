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
		return this.hidden ? this.masked : this.value;
	}
}
module.exports = Secret;
