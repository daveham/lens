import React from 'react';
import Paper from '@material-ui/core/Paper';

import { IThumbnailDescriptor } from '../../../interfaces';
import { ISimulation } from './interfaces';
import SourceThumbnail from '../../../components/sourceThumbnail';
import SimulationList from './simulationList';
import Header from './header';
import ListToolbar from './listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:view');

function renderSimulations(simulations: ReadonlyArray<ISimulation>): any {
  return <SimulationList simulationRows={simulations}/>;
}

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

function renderContents(loading: boolean, error: any, simulations: ReadonlyArray<ISimulation>): any {
  return (
    <div className={styles.contents}>
      <Paper>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && renderSimulations(simulations)}
      </Paper>
    </div>
  );
}

interface IProps {
  loading: boolean;
  error: any;
  simulations: ReadonlyArray<ISimulation>;
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
    const { loading, error, simulations, thumbnailUrl } = this.props;

    const links = {
      back: '/Catalog',
      newItem: '/Catalog' // temp
    };

    return (
      <div className={styles.container}>
        <Header title='Simulations' loading={loading}>
          {!loading && <ListToolbar links={links}/>}
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {renderContents(loading, error, simulations)}
      </div>
    );
  }
}

export default View;
