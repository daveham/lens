import React from 'react';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../interfaces';
import { ISimulation } from '../interfaces';
import SourceThumbnail from '../../../components/sourceThumbnail';
import SimulationList from './simulationList';
import Header from './header';
import ListToolbar from './listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  loading: boolean;
  error: any;
  simulations: ReadonlyArray<ISimulation>;
  sourceId: string;
  thumbnailUrl?: string;
  thumbnailImageDescriptor: IThumbnailDescriptor;
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
      sourceId,
      thumbnailUrl
    } = this.props;

    const links = {
      back: '/Catalog',
      newItem: `/Catalog/${sourceId}/Simulation/new`
    };

    return (
      <div className={styles.container}>
        <Header title='Simulations' loading={loading}>
          {!loading && <ListToolbar links={links}/>}
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
          {!loading && !error && this.renderSimulations()}
        </Paper>
      </div>
    );
  }

  private renderSimulations(): any {
    const { simulations } = this.props;
    return <SimulationList simulationRows={simulations}/>;
  }
}

export default View;
