import React from 'react';
import styles from './styles.scss';

export default ({ loading, error, data }) => (
  <div className={styles.container}>
    <div className={styles.data}>
      <h1>Renderings</h1>
      {renderContents(loading, error, data)}
    </div>
  </div>
);

function renderContents(loading, error, data) {
  if (loading) return renderLoading();
  if (error) return renderError(error);
  return renderRenderings(data);
}

function renderRenderings(data) {
  return data.renderings.map((r, index) => <div key={index}>{r.name}</div>);
}

function renderError(error) {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading() {
  return <div>'Loading...'</div>;
}
