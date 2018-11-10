import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:common:ListView');

const styles: any = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
};

function renderError(error: any): any {
  return <div>`Error: ${error.message}`</div>;
}

function renderLoading(): any {
  return <div>'Loading...'</div>;
}

interface IProps {
  classes: any;
  children: any;
  error: any;
  loading: boolean;
}

class ListView extends React.Component<IProps, any> {
  public render(): any {
    const {
      classes,
      children,
      error,
      loading,
    } = this.props;

    return (
      <div className={classes.root}>
        {loading && renderLoading()}
        {!loading && error && renderError(error)}
        {!loading && !error && children}
      </div>
    );
  }
}

export default withStyles(styles)(ListView);
