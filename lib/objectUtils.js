// @flow

exports.immutableExtend = (...objects: Array<Object>): Object =>
	Object.assign({}, ...objects);
