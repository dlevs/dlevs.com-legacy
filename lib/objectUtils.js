'use strict';

exports.immutableExtend = (...objects) =>
	Object.assign({}, ...objects);
