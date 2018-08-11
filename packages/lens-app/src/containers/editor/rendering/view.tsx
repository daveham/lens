import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '@src/interfaces';
import { backupUrl } from '@src/helpers';

import Header from '../components/header';
import SourceThumbnail from '@components/sourceThumbnail';
import renderingListRenderFunction from './renderingList';
import renderingEditRenderFunction from './renderingEdit';
import renderingNewRenderFunction from './renderingNew';
import ListToolbar from '../components/listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:rendering:view');

interface IProps {
  match: any;
  sourceId: string;
  simulationId: number;
  executionId: number;
  simulationNames: {[id: number]: string};
  executionNames: {[id: number]: string};
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
  recordPathNames: (payload: any) => void;
}

class View extends React.Component<IProps, any> {
  public componentDidMount(): any {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage
    } = this.props;

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  public render(): any {
    return (
      <div className={styles.container}>
        {this.renderToolbar()}
        {this.renderContents()}
      </div>
    );
  }

  private renderNavigationPath(): any {
    const {
      simulationId,
      simulationNames,
      executionId,
      executionNames
    } = this.props;

    const simulationName = simulationNames[simulationId];
    const executionName = executionNames[executionId];

    return (
      <div className={styles.navigation}>
        <div className={styles.segment}><span className={styles.label}>execution:</span> {executionName}</div>
        <div className={styles.segment}><span className={styles.label}>simulation:</span> {simulationName}</div>
      </div>
    );
  }

  private renderRenderingEditToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header title='Edit Rendering'>
        {this.renderNavigationPath()}
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderRenderingNewToolbar = (): any => {
    const { thumbnailUrl } = this.props;

    return (
      <Header title='New Rendering'>
        {this.renderNavigationPath()}
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderRenderingListToolbar = () => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: backupUrl(url, 2),
      newItem: `${url}/new`
    };

    return (
      <Header title='Renderings'>
        {this.renderNavigationPath()}
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderToolbar(): any {
    const { match: { path } } = this.props;
    return (
      <Switch>
        <Route path={`${path}/new`} render={this.renderRenderingNewToolbar} />
        <Route path={`${path}/:renderingId`} render={this.renderRenderingEditToolbar} />
        <Route path={path} render={this.renderRenderingListToolbar} />
      </Switch>
    );
  }

  private renderRenderingList = (props) => {
    const { sourceId, simulationId, executionId, recordPathNames } = this.props;
    return renderingListRenderFunction({ ...props, sourceId, simulationId, executionId, recordPathNames });
  };

  private renderRenderingEdit = (props) => {
    const { sourceId } = this.props;
    const { match: { params: { renderingId } }, ...other } = props;
    return renderingEditRenderFunction({ ...other, sourceId, renderingId });
  };

  private renderRenderingNew = (props) => {
    const { sourceId, simulationId, executionId } = this.props;
    return renderingNewRenderFunction({ ...props, sourceId, simulationId, executionId });
  };

  private renderContents(): any {
    const { match: { path } } = this.props;
    return (
      <div className={styles.contents}>
        <Paper>
          <Switch>
            <Route path={`${path}/new`} render={this.renderRenderingNew} />
            <Route path={`${path}/:renderingId`} render={this.renderRenderingEdit} />
            <Route path={path} render={this.renderRenderingList} />
          </Switch>
        </Paper>
      </div>
    );
  }
}

export default View;
