import React from 'react';
import Paper from '@material-ui/core/Paper';

import SourceThumbnail from '../../../components/sourceThumbnail';
import SimulationList from './simulationList';
import Header from './header';
import ListToolbar from './listToolbar';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulation:view');

function renderSimulations({ simulations }) {
  return <SimulationList simulationRows={simulations}/>;
}

function renderError(error) {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading() {
  return <div>'Loading...'</div>;
}

function renderContents(loading, error, data) {
  return (
    <div className={styles.contents}>
      <Paper>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && renderSimulations(data)}
      </Paper>
    </div>
  );
}

class View extends React.Component {
  componentDidMount() {
    const {
      thumbnailUrl,
      thumbnailImageDescriptor,
      ensureImage
    } = this.props;

    if (!thumbnailUrl) {
      ensureImage({ imageDescriptor: thumbnailImageDescriptor });
    }
  }

  render() {
    const { loading, error, data, thumbnailUrl } = this.props;

    return (
      <div className={styles.container}>
        <Header title='Simulations' loading={loading}>
          <ListToolbar />
          {thumbnailUrl && <SourceThumbnail thumbnailUrl={thumbnailUrl} />}
        </Header>
        {renderContents(loading, error, data)}
      </div>
    );
  }
}

export default View;
