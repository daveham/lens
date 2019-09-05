import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { IThumbnailDescriptor } from 'src/interfaces';
// import { backupUrl } from 'src/helpers';

import SimulationEmptyState from './simulationEmptyState';
// import simulationListRenderFunction from './simulationList';
// import simulationEditRenderFunction from './simulationEdit';
import simulationNewRenderFunction from './simulationNew';
// import simulationShowRenderFunction from './simulationShow';
// import simulationDeleteRenderFunction from './simulationDelete';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:view');

export const styles: any = (theme) => {
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
};

interface IProps {
  classes?: any;
  match: any;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  ensureEditorTitle: (sourceId?: string) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): void {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage,
      ensureEditorTitle,
      match: { params: { sourceId } },
    } = this.props;

    ensureEditorTitle(sourceId);

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  /*
        <Switch>
          <Route path={`${path}/new`} render={simulationNewRenderFunction} />
          <Route path={`${path}/:simulationId/delete`} render={simulationDeleteRenderFunction} />
          <Route path={`${path}/:simulationId/edit`} render={simulationEditRenderFunction} />
          <Route path={`${path}/:simulationId`} render={simulationShowRenderFunction} />
          <Route path={path} render={simulationEmptyStateRenderFunction} />
        </Switch>
   */
  public render(): any {
    const { classes, match: { path } } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route path={`${path}/new`} render={simulationNewRenderFunction} />
          <Route path={path} component={SimulationEmptyState} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(styles)(View);
