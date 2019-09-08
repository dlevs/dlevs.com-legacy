import { createImgSrcset, getMediaMeta } from './mediaUtils';

console.error = jest.fn();

beforeEach(() => {
	console.error.mockClear();
});

const EXISTING_IMAGE = '/media/misc/self.jpg';
const NON_EXISTING_IMAGE = '/media/foo/bar/nope.jpg';
const getMediaMetaTests = () => {
	test('responds with null when a file doesn\'t exist for the passed path', () => {
		expect(getMediaMeta(NON_EXISTING_IMAGE)).toBe(null);
		expect(console.error).toBeCalledWith(`Media meta not found for filepath ${NON_EXISTING_IMAGE}`);
	});
	test('responds with expected result for a file that does exist', () => {
		const result = getMediaMeta(EXISTING_IMAGE);
		expect(result).toMatchSnapshot();
		expect(console.error).not.toBeCalled();
	});
	test('creates an absolute src', () => {
		const result = getMediaMeta(EXISTING_IMAGE);
		expect(result.versions.default.absoluteSrc).toMatch(/https?:\/\//);
	});
};

describe('getMediaMeta()', () => {
	describe('production', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'production';
		});
		getMediaMetaTests();
		test('filepaths in response are revved', () => {
			const result = getMediaMeta(EXISTING_IMAGE);
			expect(result.versions.default.src).toMatch(/self_960x1182-.{10}\.jpg$/);
		});
	});
	describe('development', () => {
		beforeEach(() => {
			process.env.NODE_ENV = 'development';
		});
		getMediaMetaTests();
		test('filepaths in response are not revved', () => {
			const result = getMediaMeta(EXISTING_IMAGE);
			expect(result.versions.default.src.endsWith('/self_960x1182.jpg')).toBe(true);
		});
	});
});

describe('createImgSrcset()', () => {
	test('returns expected output', () => {
		expect(createImgSrcset(
			{ src: 'foo.jpg', width: 100 },
			{ src: 'foo-large.jpg', width: 200 },
		)).toBe('foo.jpg 100w, foo-large.jpg 200w');
	});
});
