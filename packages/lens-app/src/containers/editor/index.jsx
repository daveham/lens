import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Simulation from './simulation';
import Execution from './execution';
import Rendering from './rendering';

// import _debug from 'debug';
// const debug = _debug('lens:containers:editor:index');

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.app.backgroundColor,
    boxSizing: 'border-box',
    display: 'flex',
    flex: '1 0 auto',
    flexFlow: 'column',
  },
});

const SimulationRouteSwitch = ({ classes, match: { path } }) => (
  <div className={classes.root}>
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

export default withStyles(styles)(SimulationRouteSwitch);
