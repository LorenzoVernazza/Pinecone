function quote(value, mark = '\'', process) {
	return mark + process(value) + mark;
}
module.exports = {
	quote
};
