import React from 'react';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../../interfaces';
import { IRendering } from '../../interfaces';
import SourceThumbnail from '../../../../components/sourceThumbnail';
import RenderingList from './renderingList';
import Header from '../../components/header';
import ListToolbar from '../../components/listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:rendering:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  loading: boolean;
  error: any;
  renderings: ReadonlyArray<IRendering>;
  sourceId?: string;
  simulationId?: number;
  executionId?: number;
  thumbnailUrl?: string;
  thumbnailImageDescriptor?: IThumbnailDescriptor;
  ensureImage: (payload: {[imageDescriptor: string]: IThumbnailDescriptor}) => void;
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
    const {
      loading,
      thumbnailUrl,
      sourceId,
      simulationId,
      executionId
    } = this.props;

    const links = {
      back: `/Catalog/${sourceId}/Simulation/${simulationId}/Execution`,
      newItem: `/Catalog/${sourceId}/Simulation/${simulationId}/Execution/${executionId}/Rendering/new`
    };

    return (
      <div className={styles.container}>
        <Header title='Renderings' loading={loading}>
          {!loading && <ListToolbar links={links} />}
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {this.renderContents()}
      </div>
    );
  }

  private renderContents(): any {
    const { loading, error } = this.props;
    return (
      <div className={styles.contents}>
        <Paper>
          {loading && renderLoading()}
          {!loading && error && renderError(error)}
          {!loading && !error && this.renderRenderings()}
        </Paper>
      </div>
    );
  }

  private renderRenderings(): any {
    const {
      renderings,
      sourceId,
      simulationId,
      executionId,
    } = this.props;
    return (
      <RenderingList
        renderingRows={renderings}
        sourceId={sourceId}
        simulationId={simulationId}
        executionId={executionId}
      />
    );
  }
}

export default View;
