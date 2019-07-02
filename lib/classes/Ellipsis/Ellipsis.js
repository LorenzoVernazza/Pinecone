class Ellipsis {
	constructor(defaultValue = 0, replacement = '...'){
		this.defaultValue = defaultValue > 0 ? defaultValue : 0;
		this.replacement = replacement;
	}
	trim(input, length = this.defaultValue, replacement = this.replacement){
		if (length > 0) {
			return input.substr(0, length - replacement.length) + replacement;
		} else {
			return input;
		}
	}
}

module.exports = Ellipsis;