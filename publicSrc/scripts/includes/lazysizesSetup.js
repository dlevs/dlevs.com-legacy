import 'lazysizes';

const init = () => {
	document.addEventListener('lazyloaded', ({ target }) => {
		const picture = target.closest('.picture--lazyload');

		picture.classList.add('picture--lazyloaded');

		// Add a generous timeout to allow transitions to end before removing
		// background loading animations.
		setTimeout(() => {
			picture.classList.add('picture--lazyloaded-transitions-ended');
		}, 500);
	});
};

export default init;
