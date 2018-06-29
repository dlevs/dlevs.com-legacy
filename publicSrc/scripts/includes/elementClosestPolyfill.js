// Element.prototype.closest polyfill
// https://github.com/jonathantneal/closest/blob/master/element-closest.js
const { prototype } = window.Element;

if (typeof prototype.matches !== 'function') {
	// eslint-disable-next-line no-param-reassign
	prototype.matches = (
		prototype.msMatchesSelector ||
		prototype.mozMatchesSelector ||
		prototype.webkitMatchesSelector ||
		function matches(selector) {
			const element = this;
			const elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			let index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		}
	);
}

if (typeof prototype.closest !== 'function') {
	// eslint-disable-next-line no-param-reassign
	prototype.closest = function closest(selector) {
		let element = this;

		while (element && element.nodeType === 1) {
			if (element.matches(selector)) {
				return element;
			}

			element = element.parentNode;
		}

		return null;
	};
}
