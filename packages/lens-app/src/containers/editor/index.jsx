import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { snackbarMessageSelector } from 'editor/modules/selectors';
import { makeStyles } from '@material-ui/core/styles';
import { clearSnackbarMessage, clearEditor } from 'editor/modules/actions/ui';

import Guide from './guide';
import Simulation from './simulation';
import Execution from './execution';
import Rendering from './rendering';

import getDebugLog from './debugLog';
const debug = getDebugLog();

const useStyles = makeStyles((theme) => ({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flex: 'auto',
  },
  guide: {
    width: theme.spacing(50),
    display: 'flex',
    flexFlow: 'column',
  },
  detail: {
    display: 'flex',
    flex: 'auto',
    flexFlow: 'column',
  },
  snackRoot: {
    right: theme.spacing(7),
    bottom: theme.spacing(7),
  },
}));

const SimulationRouteSwitch = ({ match: { path } }) => {
  debug('SimulationRouteSwitch', { path });

  const [open, setOpen] = useState(false);
  const { snackbarMessage, snackbarError } = useSelector(snackbarMessageSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearEditor());
    };
  }, [dispatch]);

  useEffect(() => {
    setOpen(Boolean(snackbarMessage));
  }, [snackbarMessage]);

  const handleCloseSnackbar = () => {
    dispatch(clearSnackbarMessage());
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.guide}>
        <Switch>
          <Route
            path={`${path}/:simulationId/Execution/:executionId/Rendering/:renderingId?/:action?`}
            component={Guide}
          />
          <Route path={`${path}/:simulationId/Execution/:executionId?/:action?`} component={Guide} />
          <Route path={`${path}/:simulationId?/:action?`} component={Guide} />
        </Switch>
      </div>
      <div className={classes.detail}>
        <Switch>
          <Route
            path={`${path}/:simulationId/Execution/:executionId/Rendering/:renderingId?/:action?`}
            component={Rendering}
          />
          <Route
            path={`${path}/:simulationId/Execution/:executionId?/:action?`}
            component={Execution}
          />
          <Route path={`${path}/:simulationId?/:action?`} component={Simulation} />
        </Switch>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{ root: classes.snackRoot }}
        open={open}
        autoHideDuration={snackbarError ? 10000 : 4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarError ? 'error' : 'success' }
          variant='filled'
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SimulationRouteSwitch;
