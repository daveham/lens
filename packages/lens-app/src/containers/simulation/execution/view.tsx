import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '@src/interfaces';
import { backupUrl } from '@src/helpers';

import Header from '../components/header';
import SourceThumbnail from '@components/sourceThumbnail';
import executionListRenderFunction from './components/executionList';
import executionEditRenderFunction from './components/executionEdit';
import executionNewRenderFunction from './components/executionNew';
import ListToolbar from '../components/listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:execution:view');

interface IProps {
  match: any;
  sourceId: string;
  simulationId: number;
  simulationNames: {[id: number]: string};
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
      simulationNames
    } = this.props;

    const simulationName = simulationNames[simulationId];

    return (
      <div className={styles.navigation}>
        <div className={styles.segment}><span className={styles.label}>simulation:</span> {simulationName}</div>
      </div>
    );
  }

  private renderExecutionEditToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: url
    };

    return (
      <Header title='Edit Execution'>
        {this.renderNavigationPath()}
        <ListToolbar links={links} />
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderExecutionNewToolbar = (): any => {
    const { thumbnailUrl } = this.props;

    return (
      <Header title='New Execution'>
        {this.renderNavigationPath()}
        {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
      </Header>
    );
  };

  private renderExecutionListToolbar = (): any => {
    const { thumbnailUrl, match: { url } } = this.props;
    const links = {
      back: backupUrl(url, 2),
      newItem: `${url}/new`
    };

    return (
      <Header title='Executions'>
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
        <Route path={`${path}/new`} render={this.renderExecutionNewToolbar} />
        <Route path={`${path}/:executionId`} render={this.renderExecutionEditToolbar} />
        <Route path={path} render={this.renderExecutionListToolbar} />
      </Switch>
    );
  }

  private renderExecutionList = (props) => {
    const { sourceId, simulationId, recordPathNames } = this.props;
    return executionListRenderFunction({ ...props, sourceId, simulationId, recordPathNames });
  };

  private renderExecutionEdit = (props) => {
    const { sourceId, simulationId } = this.props;
    const { match: { params: { executionId } }, ...other } = props;
    return executionEditRenderFunction({ ...other, sourceId, simulationId, executionId });
  };

  private renderExecutionNew = (props) => {
    const { sourceId, simulationId } = this.props;
    return executionNewRenderFunction({ ...props, sourceId, simulationId });
  };

  private renderContents(): any {
    const { match: { path } } = this.props;
    return (
      <div className={styles.contents}>
        <Paper>
          <Switch>
            <Route path={`${path}/new`} render={this.renderExecutionNew} />
            <Route path={`${path}/:executionId`} render={this.renderExecutionEdit} />
            <Route path={path} render={this.renderExecutionList} />
          </Switch>
        </Paper>
      </div>
    );
  }
}

export default View;
