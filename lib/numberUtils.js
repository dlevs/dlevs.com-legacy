// @flow

/**
 * Like Number.prototype.toFixed, but without trailing zeros.
 */
exports.toFixedTrimmed = (n: number, digits: number): string => n
	.toFixed(digits)
	// Remove zeros after decimal place
	.replace(/(\..*?)(0+)$/, '$1')
	// Remove decimal place if it's now at the end
	.replace(/\.$/, '');
