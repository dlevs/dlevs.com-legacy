export const init = () => {
	document.addEventListener('click', (e) => {
		const link = e.target.closest('a');

		// Links can't technically be disabled via normal disabled attribute.
		// Emulate via aria-disabled attribute.
		if (link && link.getAttribute('aria-disabled') === 'true') {
			e.preventDefault();
		}
	});
};
