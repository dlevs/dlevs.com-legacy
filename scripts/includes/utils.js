/**
 * Focus an element without having the page scroll jump to that element.
 *
 * @param {HTMLElement} elem
 */
export const focusWithoutScrolling = (elem) => {
	const x = window.pageXOffset;
	const y = window.pageYOffset;
	elem.focus();
	window.scrollTo(x, y);
};

/**
 * Get the keyCode of the last key pressed.
 *
 * @returns {null|number}
 */
export const getLastKeyCode = (() => {
	let lastKeyCode = null;
	document.addEventListener('keydown', ({ keyCode }) => {
		lastKeyCode = keyCode;
	});
	return () => lastKeyCode;
})();

/**
 * Get the last input device used.
 *
 * @returns {null|('mouse'|'keyboard')}
 */
export const getLastInputDevice = (() => {
	let lastDevice = null;
	document.addEventListener('mousedown', () => {
		lastDevice = 'mouse';
	});
	document.addEventListener('keydown', () => {
		lastDevice = 'keyboard';
	});
	return () => lastDevice;
})();
