import instantclick from 'instantclick';

const READMORE_MAX_WIDTH = 500;
const SELECTOR = '[data-readmore-summary]';

const hideMore = () => {
	if (window.innerWidth > READMORE_MAX_WIDTH) return;

	const elems = Array.prototype.slice.call(
		document.querySelectorAll(SELECTOR)
	);

	elems.forEach((elem) => {
		const button = '<p><button>Read more...</button></p>';
		elem.dataset.readmoreFull = elem.innerHTML;
		elem.innerHTML = elem.dataset.readmoreSummary + button;
	});
};

const showMore = (event) => {
	const wrapper = event.target.closest(SELECTOR);
	if (wrapper && wrapper.dataset.readmoreFull) {
		wrapper.innerHTML = wrapper.dataset.readmoreFull;
	}
};

export const init = () => {
	hideMore();
	document.addEventListener('click', showMore, false);
	instantclick.on('change', hideMore);
};
