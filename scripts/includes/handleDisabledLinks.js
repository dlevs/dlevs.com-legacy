module.exports = {
	init: function() {

		document.addEventListener('click', function (e) {
			var link = e.target.closest('a');

			// Links can't technically be disabled via normal disabled attribute.
			// Emulate via aria-disabled attribute.
			if (link && link.getAttribute('aria-disabled') === 'true') {
				e.preventDefault();
			}
		});

	}
}
