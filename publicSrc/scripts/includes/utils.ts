/**
 * Focus an element without having the page scroll jump to that element.
 */
export const focusWithoutScrolling = (elem: HTMLElement) => {
	const x = window.pageXOffset;
	const y = window.pageYOffset;
	elem.focus();
	window.scrollTo(x, y);
};

/**
 * Get the keyCode of the last key pressed.
 */
export const getLastKeyCode = (() => {
	let lastKeyCode: number | null = null;
	document.addEventListener('keydown', ({ keyCode }) => {
		lastKeyCode = keyCode;
	});
	return () => lastKeyCode;
})();

/**
 * Get the last input device used.
 */
export const getLastInputDevice = (() => {
	let lastDevice: 'mouse' | 'keyboard' = 'mouse';
	document.addEventListener('mousedown', () => {
		lastDevice = 'mouse';
	});
	document.addEventListener('keydown', () => {
		lastDevice = 'keyboard';
	});
	return () => lastDevice;
})();

/**
 * Check if a touch event has occurred in the last `timeout`
 * milliseconds.
 */
export const wasRecentlyTouched = (() => {
	let lastTouched: number | null = null;
	document.addEventListener('touchstart', () => {
		lastTouched = Date.now();
	});
	return (timeout = 100) => {
		if (!lastTouched) {
			return false;
		}
		return (Date.now() - timeout) < lastTouched;
	};
})();

/**
 * Test a path to see if it has a file extension.
 *
 * @example
 * hasExtension('/');                 // false
 * hasExtension('/travel');           // false
 * hasExtension('/travel/cats.mp4');  // true
 * hasExtension('/travel/cats.json'); // true
 */
export const hasExtension = (pathname: string) => /\.[^/.]+$/.test(pathname);

/**
 * A wrapper around `document.querySelectorAll` that returns a plain array
 * instead of a `NodeList` instance.
 */
export const $ = (selector: string) =>
	Array.prototype.slice.call(document.querySelectorAll(selector));
