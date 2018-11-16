import React, { Fragment } from 'react';

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
      <Fragment>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && children}
      </Fragment>
    );
  }
}

export default ListView;
