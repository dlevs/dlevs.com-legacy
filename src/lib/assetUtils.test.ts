import { getRevvedPath } from './assetUtils';

console.error = jest.fn();

beforeEach(() => {
	console.error.mockClear();
});

describe('getRevvedPath()', () => {
	describe('production', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'production';
		});
		test('returns a revved path where it exists', async () => {
			expect(getRevvedPath('/favicon.ico')).toMatch(/^\/favicon-.{10}\.ico$/);
			expect(console.error).not.toBeCalled();
		});
		test('returns the input when a revved path doesn\'t exist', async () => {
			expect(getRevvedPath('/foo.jpg')).toBe('/foo.jpg');
			expect(console.error).toBeCalledWith('No revved asset found for path /foo.jpg');
		});
	});

	describe('development', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'development';
		});
		test('always returns the unrevved path', async () => {
			expect(getRevvedPath('/favicon.ico')).toBe('/favicon.ico');
			expect(console.error).not.toBeCalled();

			expect(getRevvedPath('/foo.jpg')).toBe('/foo.jpg');
			expect(console.error).toBeCalledWith('No revved asset found for path /foo.jpg');
		});
	});
});
