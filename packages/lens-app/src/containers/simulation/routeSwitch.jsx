import * as React from 'react';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';

import Simulation from './wrappedView';
import Execution from './execution';

export default () => (
  <div>
    <RouterSwitch>
      <RouterRoute path='/Catalog/:id/Simulation/:simulationId/Execution' component={Execution} />
      <RouterRoute component={Simulation} />
    </RouterSwitch>
  </div>
);
