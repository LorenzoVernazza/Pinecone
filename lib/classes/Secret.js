class Secret {
	constructor(value, replacement = '*', level = 'debug', hidden = true) {
		this.value = value;
		this.replacement = replacement;
		this.level = level;
		this.hidden = hidden;
	};
	get masked() {
		return this.value.replace(/./g, this.replacement);
	};
	toString(){
		return this.hidden ? this.masked : this.value;
	};
};
module.exports = Secret;
