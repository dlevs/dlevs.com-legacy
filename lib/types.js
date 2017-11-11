// @flow

// TODO: check back to see if this is added to flow in future
export type ErrorEvent = {
	message: string,
	filename: string,
	lineno: number,
	colno: number,
};
