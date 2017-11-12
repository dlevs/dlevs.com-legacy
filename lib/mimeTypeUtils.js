/**
 * Create a function which returns `true` if the MIME type passed
 * matches a value in the `types` list.
 *
 * This function exists because the equivalent regex would be ugly
 * and harder to read.
 *
 * @example
 * const matcher = createMimeMatcher([
 *     'image/*',
 *     'text/css'
 * ]);
 * matcher('text/css');   // true
 * matcher('text/plain'); // false
 * matcher('image/png');  // true
 *
 * @param {Array<String>} types
 */
const createMimeMatcher = (types) => {
	const completeTypes = types
		.filter(type => !type.endsWith('/*'));

	const typeBeginnings = types
		.filter(type => type.endsWith('/*'))
		.map(type => type.replace('*', ''));

	return type => (
		completeTypes.includes(type) ||
		typeBeginnings.some(typeStart => type.startsWith(typeStart))
	);
};

module.exports = {
	createMimeMatcher,
};
