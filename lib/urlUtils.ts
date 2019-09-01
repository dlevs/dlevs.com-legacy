import normalizeUrl from 'normalize-url';

/**
 * Get a normalized version of a URL for canonical purposes.
 *
 * @param {String} url
 */
export const getCanonicalUrl = (url: string) => normalizeUrl(url, {
	removeQueryParameters: ['pretty', 'pid', 'gid'],
});

/**
 * Get a normalized version of a URL for sharing purposes.
 *
 * @param {String} url
 */
export const getShareUrl = (url: string) => normalizeUrl(url, {
	removeQueryParameters: ['pretty'],
});
