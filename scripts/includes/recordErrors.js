// This module needs to be imported first in order to catch errors.
window.ERRORS = [];
window.addEventListener('error', ({message, filename, lineno, colno}) => {
	ERRORS.push({message, filename, lineno, colno});
});
