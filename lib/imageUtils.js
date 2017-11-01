exports.createImgSrcset = (...images) =>
	images.map(({src, width}) => `${src} ${width}w`).join(', ');
