export type ValueOf<T> = T[keyof T];
export type MapOf<T> = { [key: string]: T | undefined }
export type StringMap = MapOf<string>;
export interface OpenGraphMeta {
	// TODO: Ignore this _og stuff in output. Type more strictly.
	// Raw input type should not be same as output
	'_og:image'?: {
		absoluteSrc: string;
		type: string;
		width: number;
		height: number;
	};
	'og:image'?: string;
	// TODO: Can these be typed better? E.g. presence of og:image makes og:image:width mandatory?
	'og:image:width'?: number;
	'og:image:height'?: number;
	'og:image:alt'?: string;
	'og:image:type'?: string;
	'og:type'?: string;
	'profile:first_name'?: string;
	'profile:last_name'?: string;
	'profile:gender'?: string;
	'profile:username'?: string;
}
