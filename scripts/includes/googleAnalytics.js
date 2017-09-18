var instantclick = require('instantclick');

module.exports = {
	init: function () {
		if (!window.isGoogleAnalyticsActive) return;

		instantclick.on('change', function () {
			ga('set', 'page', location.pathname + location.search);
			ga('send', 'pageview');
		});

	}
};
