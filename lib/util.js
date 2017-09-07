exports.getParentPath = path => path
	.split('/')
	.slice(0, -1)
	.join('/');
