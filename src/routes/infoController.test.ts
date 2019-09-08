'use strict';

import flow from 'lodash/flow';
import unset from 'lodash/fp/unset';
import { testControllerSnapshots } from '/tests/testLib/testUtils';
import infoController from './infoController'();

testControllerSnapshots(infoController, {
	index: {
		mapData: data => flow(
			unset('ctx.body.date'),
			unset('ctx.body.serverStartDate'),
			unset('ctx.body.lastCommit'),
		)(data),
		contexts: [{}],
	},
});
