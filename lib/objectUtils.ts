// TODO: This is a terrible name. Rename to something like "extend" or "assign"
export const immutableExtend = (...objects) =>
	Object.assign({}, ...objects);
