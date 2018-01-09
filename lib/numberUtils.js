'use strict';

/**
 * Like Number.prototype.toFixed, but without trailing zeros.
 *
 * @param {Number} n
 * @param {Number} digits
 * @returns {String}
 */
exports.toFixedTrimmed = (n, digits) => n
	.toFixed(digits)
	// Remove zeros after decimal place
	.replace(/(\..*?)(0+)$/, '$1')
	// Remove decimal place if it's now at the end
	.replace(/\.$/, '');
