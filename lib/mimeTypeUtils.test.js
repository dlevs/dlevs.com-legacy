const { createMimeMatcher } = require('./mimeTypeUtils');

describe('createMimeMatcher()', () => {
	test('matches normal MIME types', () => {
		const matcher = createMimeMatcher([
			'text/plain',
			'text/html',
			'image/jpeg',
		]);
		// Positive
		expect(matcher('text/plain')).toBe(true);
		expect(matcher('text/html')).toBe(true);
		expect(matcher('image/jpeg')).toBe(true);

		// Negative
		expect(matcher('image/png')).toBe(false);
		expect(matcher('text/richtext')).toBe(false);
		expect(matcher('application/javascript')).toBe(false);
	});

	test('matches wildcard at end', () => {
		const matcher = createMimeMatcher([
			'text/*',
			'image/*',
		]);
		// Positive
		expect(matcher('text/plain')).toBe(true);
		expect(matcher('text/html')).toBe(true);
		expect(matcher('text/richtext')).toBe(true);
		expect(matcher('image/jpeg')).toBe(true);
		expect(matcher('image/png')).toBe(true);

		// Negative
		expect(matcher('application/javascript')).toBe(false);
	});

	test('wildcard works in combination with normal MIME types', () => {
		const matcher = createMimeMatcher([
			'text/plain',
			'image/*',
		]);
		// Positive
		expect(matcher('text/plain')).toBe(true);
		expect(matcher('image/jpeg')).toBe(true);
		expect(matcher('image/png')).toBe(true);

		// Negative
		expect(matcher('text/html')).toBe(false);
		expect(matcher('text/richtext')).toBe(false);
		expect(matcher('application/javascript')).toBe(false);
	});
});
