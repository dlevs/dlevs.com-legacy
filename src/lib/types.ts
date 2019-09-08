export type ValueOf<T> = T[keyof T];
export type MapOf<T> = { [key: string]: T | undefined }
export type StringMap = MapOf<string>;
