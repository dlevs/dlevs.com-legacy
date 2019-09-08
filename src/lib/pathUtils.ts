import path from 'path';

export const root = (...args: string[]) =>
	path.resolve(__dirname, '../', ...args);

export const relativeToRoot = (filepath: string) =>
	path.relative(root('./'), filepath);
