import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';

import SimulationEmptyState from './simulationEmptyState';
import SimulationNew from './simulationNew';
import SimulationShow from './simulationShow';
import SimulationEdit from './simulationEdit';
import SimulationDelete from './simulationDelete';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:view');

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2),
    width: '100%',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IProps {
  match: any;
}

const View = (props: IProps) => {
  const { match: { path } } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Switch>
        <Route path={`${path}/new`} component={SimulationNew} />
        <Route path={`${path}/:simulationId/delete`} render={SimulationDelete} />
        <Route path={`${path}/:simulationId/edit`} render={SimulationEdit} />
        <Route path={`${path}/:simulationId`} render={SimulationShow} />
        <Route path={path} component={SimulationEmptyState} />
      </Switch>
    </div>
  );
};

export default View;
