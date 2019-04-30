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
		if (this.maxLength) {
			return this.value.slice(0, this.maxLength).replace(/./g, this.replacement);
		} else {
			return this.value.replace(/./g, this.replacement);
		}
	};
	toString(){
		return this.hidden ? this.masked : this.value;
	};
};
module.exports = Secret;
