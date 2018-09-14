import React from 'react';
import styles from './listViewStyles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:editor:common:ListView');

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  children: any;
  error: any;
  loading: boolean;
}

class ListView extends React.Component<IProps, any> {
  public render(): any {
    const {
      children,
      error,
      loading,
    } = this.props;

    return (
      <div className={styles.container}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && children}
      </div>
    );
  }
}

export default ListView;
