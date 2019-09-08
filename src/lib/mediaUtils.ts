import mapValues from 'lodash/mapValues';
import media from '/data/generated/media.json';
import { getRevvedPath } from './assetUtils';

export const createImgSrcset = (...images) =>
	images.map(({ src, width }) => `${src} ${width}w`).join(', ');

/**
 * For a filepath, get meta for all versions of that image.
 */
export const getMediaMeta = (filepath: string) => {
	const meta = media[filepath];

	if (meta) {
		return {
			...meta,
			versions: mapValues(
				meta.versions,
				(version) => {
					const revvedSrc = getRevvedPath(version.src);
					return {
						...version,
						src: revvedSrc,
						absoluteSrc: `${process.env.ORIGIN}${revvedSrc}`,
					};
				},
			),
		};
	}

	// eslint-disable-next-line no-console
	console.error(`Media meta not found for filepath ${filepath}`);
	return null;
};
