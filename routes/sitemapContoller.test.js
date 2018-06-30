'use strict';

const { testControllerSnapshots, getMockControllerParams } = require('../tests/testLib/testUtils');
const sitemapController = require('./sitemapController')(getMockControllerParams());

testControllerSnapshots(sitemapController.controller, {
	html: { contexts: [{}] },
	xml: { contexts: [{}] },
});
