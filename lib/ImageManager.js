const imageMeta = require('../images/meta');

class ImageManager {
	constructor(src) {
		this.images = imageMeta[src];
	}

	getAllOfFormat(format = 'jpeg') {
		return this.images.filter((image) => image.format === format);
	}

	getLargest(format) {
		return this.getAllOfFormat(format).reduce(
			(largest, current) => {
				return current.width > largest.width
					? current
					: largest;
			},
			this.images[0]
		)
	}

	getDefault() {
		return this.images.find((image) => image.default)
	}

	getWebp() {
		return this.images.find((image) => image.format === 'webp')
	}
}

module.exports = ImageManager;
