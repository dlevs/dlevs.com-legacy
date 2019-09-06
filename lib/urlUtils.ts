import normalizeUrl from 'normalize-url';

/**
 * Get a normalized version of a URL for canonical purposes.
 */
export const getCanonicalUrl = (url: string) => normalizeUrl(url, {
	removeQueryParameters: ['pretty', 'pid', 'gid'],
});

/**
 * Get a normalized version of a URL for sharing purposes.
 */
export const getShareUrl = (url: string) => normalizeUrl(url, {
	removeQueryParameters: ['pretty'],
});
