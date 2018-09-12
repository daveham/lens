import React from 'react';

import { IRendering } from 'editor/interfaces';
import RenderingTable from './renderingTable';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:editor:rendering:renderingList:view');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  url: string;
  loading: boolean;
  error: any;
  renderings: ReadonlyArray<IRendering>;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    const {
      error,
      loading,
      renderings,
      url
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && (
          <RenderingTable
            renderingRows={renderings}
            url={url}
          />
        )}
      </div>
    );
  }
}

export default View;
