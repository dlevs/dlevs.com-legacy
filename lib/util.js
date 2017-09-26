exports.getParentPath = (path) => path
	.split('/')
	.slice(0, -1)
	.join('/');

exports.expandBreadcrumb = (breadcrumb) => {
	const currentSlugs = [];

	return breadcrumb.map(({slug = '', ...otherProps}) => {
		currentSlugs.push(slug);

		return {
			...otherProps,
			slug,
			path: currentSlugs.join('/') || '/'
		}
	});
};

exports.toFixedTrimmed = (n, digits) => n
	.toFixed(digits)
	// Remove zeros after decimal place
	.replace(/(\..*?)(0+)$/, '$1')
	// Remove decimal place if it's now at the end
	.replace(/\.$/, '');
