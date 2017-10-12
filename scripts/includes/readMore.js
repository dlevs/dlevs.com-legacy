export const init = () => {
	document.addEventListener(
		'click',
		({target}) => {
			if (target.classList.contains('js-readmore-button')) {
				target.parentNode.classList.add('js-readmore-active');
			}
		},
		false
	);
};
