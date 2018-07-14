import React from 'react';
import { Switch as RouterSwitch, Route as RouterRoute } from 'react-router-dom';

import Simulation from './view';
import Execution from './execution';
import Rendering from './rendering';

// import _debug from 'debug';
// const debug = _debug('lens:containers:simulationRouteSwitch');

const SimulationRouteSwitch = () => (
  <div>
    <RouterSwitch>
      <RouterRoute
        path='/Catalog/:sourceId/Simulation/:simulationId/Execution/:executionId/Rendering'
        component={Rendering}
      />
      <RouterRoute
        path='/Catalog/:sourceId/Simulation/:simulationId/Execution'
        component={Execution}
      />
      <RouterRoute
        path='/Catalog/:sourceId/Simulation'
        component={Simulation}
      />
    </RouterSwitch>
  </div>
);

export default SimulationRouteSwitch;
