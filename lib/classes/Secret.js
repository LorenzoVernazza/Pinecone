/**
 * Represents a secret.
 */
class Secret {
	constructor(value, {
		replacement = '*',
		level = 'debug',
		hidden = true,
		maxLength
	}) {
		this.value = value;
		this.replacement = replacement;
		this.level = level;
		this.hidden = hidden;
		this.maxLength = maxLength;
	};
	get masked() {
		return Buffer.alloc(
			this.maxLength > 0 ? Math.min(this.value.length, this.maxLength) : this.value.length,
			this.replacement
		).toString();
	};
	toString(){
		return this.hidden ? this.masked : this.value;
	};
};
module.exports = Secret;
