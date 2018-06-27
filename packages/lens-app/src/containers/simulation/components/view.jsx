import React from 'react';
import Paper from '@material-ui/core/Paper';
import SimulationList from './simulationList';
import Header from './header';
import ListToolbar from './listToolbar';
import styles from './styles.scss';

export default ({ loading, error, data }) => (
  <div className={styles.container}>
    <Header title='Simulations' loading={loading}>
      <ListToolbar />
    </Header>
    {renderContents(loading, error, data)}
  </div>
);

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

function renderSimulations({ simulations }) {
  return <SimulationList simulationRows={simulations}/>;
}

function renderError(error) {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading() {
  return <div>'Loading...'</div>;
}
