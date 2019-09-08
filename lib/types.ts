import { Context } from 'koa';

export type KoaMiddlewareFn = (
	ctx: Context,
	next: () => Promise<void>,
) => void;

export type StringMap = { [key: string]: string };
