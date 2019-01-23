import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Guide from './guide';
import Simulation from './simulation';
import Execution from './execution';
import Rendering from './rendering';

// import _debug from 'debug';
// const debug = _debug('lens:containers:editor:index');

const styles = (theme) => ({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 'auto',
  },
  guide: {
    width: theme.spacing.unit * 50,
    display: 'flex',
    flexFlow: 'column',
  },
  detail: {
    display: 'flex',
    flex: 'auto',
    flexFlow: 'column',
  },
});

const SimulationRouteSwitch = ({ classes, match: { path } }) => (
  <div className={classes.root}>
    <div className={classes.guide}>
      <Switch>
        <Route
          path={`${path}/:simulationId/Execution/:executionId/Rendering/:renderingId?/:action?`}
          component={Guide}
        />
        <Route
          path={`${path}/:simulationId/Execution/:executionId?/:action?`}
          component={Guide}
        />
        <Route
          path={`${path}/:simulationId?/:action?`}
          component={Guide}
        />
      </Switch>
    </div>
    <div className={classes.detail}>
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
  </div>
);

export default withStyles(styles)(SimulationRouteSwitch);
