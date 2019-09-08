'use strict';

import { testControllerSnapshots } from '@root/tests/testLib/testUtils';
import robotsController from './robotsController'();

testControllerSnapshots(robotsController, {
	index: { contexts: [{}] },
});
