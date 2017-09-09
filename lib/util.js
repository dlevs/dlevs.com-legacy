exports.getParentPath = (path) => path
	.split('/')
	.slice(0, -1)
	.join('/');

exports.expandBreadcrumb = (breadcrumb) => {
	const currentSlugs = [];

	return breadcrumb.map(({slug='', ...otherProps}) => {
		currentSlugs.push(slug);

		return {
			...otherProps,
			slug,
			path: currentSlugs.join('/') || '/'
		}
	});
};
