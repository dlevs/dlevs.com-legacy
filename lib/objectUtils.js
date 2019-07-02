'use strict';

// TODO: This is a terrible name. Rename to something like "extend" or "assign"
exports.immutableExtend = (...objects) =>
	Object.assign({}, ...objects);
