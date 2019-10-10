import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';

import SimulationEmptyState from './simulationEmptyState';
// import simulationListRenderFunction from './simulationList';
import SimulationNew from './simulationNew';
import SimulationShow from './simulationShow';
import SimulationEdit from './simulationEdit';
// import simulationDeleteRenderFunction from './simulationDelete';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:view');

const useStyles: any = makeStyles((theme: any) => {
  const unit = theme.spacing(1);
  return {
    root: {
      padding: unit * 2,
      width: '100%',
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
    },
  };
});

interface IProps {
  match: any;
}

const View = (props: IProps) => {
  const { match: { path } } = props;
  const classes = useStyles();

  /*
        <Switch>
          <Route path={`${path}/new`} render={simulationNewRenderFunction} />
          <Route path={`${path}/:simulationId/delete`} render={simulationDeleteRenderFunction} />
          <Route path={`${path}/:simulationId/edit`} render={simulationEditRenderFunction} />
          <Route path={`${path}/:simulationId`} render={simulationShowRenderFunction} />
          <Route path={path} render={simulationEmptyStateRenderFunction} />
        </Switch>
   */

  return (
    <div className={classes.root}>
      <Switch>
        <Route path={`${path}/new`} component={SimulationNew} />
        <Route path={`${path}/:simulationId/edit`} render={SimulationEdit} />
        <Route path={`${path}/:simulationId`} render={SimulationShow} />
        <Route path={path} component={SimulationEmptyState} />
      </Switch>
    </div>
  );
};

export default View;
