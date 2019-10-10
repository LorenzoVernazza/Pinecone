const fs = require('fs');
const path = require('path');
const { packagePath, packageName } = require('../../../config').common;
var myPackage;

function load(pPath = packagePath, pName = packageName) {
	try {
		myPackage = JSON.parse(fs.readFileSync(path.join(pPath, pName)).toString());
		return myPackage;
	} catch (err) {
		return false;
	}
}

function unload() {
	myPackage = undefined;
}

function getFromPackage(/** Property to get. */prop, /** Replacement value when not found. */replacement = undefined) {
	if (!myPackage && !load()) {
		return replacement;
	}
	if (!prop) return myPackage;
	const keys = prop.split('.');
	let current = myPackage;
	for (var key of keys) {
		if (current[key] === undefined) return replacement;
		else current = current[key];
	}
	return current;
}

const Package = getFromPackage;
Object.defineProperties(Package, {
	load: {
		value: load
	},
	unload: {
		value: unload
	},
	name: {
		get: () => (myPackage ? myPackage.name : undefined)
	},
	version: {
		get: () => (myPackage ? myPackage.version : undefined)
	}
});
Object.seal(Package);

module.exports = Package;