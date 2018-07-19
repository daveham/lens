import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Simulation from './view';
import Execution from './execution';
import Rendering from './rendering';

// import _debug from 'debug';
// const debug = _debug('lens:containers:simulationRouteSwitch');

const SimulationRouteSwitch = ({ match: { path } }) => (
  <div>
    <Switch>
      <Route
        path={`${path}/:simulationId/Execution/:executionId/Rendering`}
        component={Rendering}
      />
      <Route
        path={`${path}/:simulationId/Execution`}
        component={Execution}
      />
      <Route
        path={path}
        component={Simulation}
      />
    </Switch>
  </div>
);

export default SimulationRouteSwitch;
