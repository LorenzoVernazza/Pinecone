class Secret {
	constructor(value, replacement = '*', level = 'debug') {
		this.value = value;
		this.replacement = replacement;
		this.level = level;
	};
	toString(){
		return this.value.replace(/./g, this.replacement);
	};
};
module.exports = Secret;
