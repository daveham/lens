import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';

import { makeThumbnailImageDescriptor } from '@lens/image-descriptors';
import { ensureImage } from 'modules/images/actions';
// import { backupUrl } from 'src/helpers';

import SimulationEmptyState from './simulationEmptyState';
// import simulationListRenderFunction from './simulationList';
// import simulationEditRenderFunction from './simulationEdit';
import SimulationNew from './simulationNew';
// import simulationShowRenderFunction from './simulationShow';
// import simulationDeleteRenderFunction from './simulationDelete';
import { ensureEditorTitle } from 'editor/modules/actions';

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
  const {
    match: {
      params: {
        sourceId,
      },
      path,
    },
  } = props;

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (sourceId) {
      dispatch(ensureEditorTitle(sourceId));
      dispatch(ensureImage({ imageDescriptor: makeThumbnailImageDescriptor(sourceId) }));
    }
  }, [dispatch, sourceId]);

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
        <Route path={path} component={SimulationEmptyState} />
      </Switch>
    </div>
  );
};

export default View;
