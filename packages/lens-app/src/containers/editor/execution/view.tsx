import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';

import ExecutionEmptyState from './executionEmptyState';
import ExecutionNew from './executionNew';
import ExecutionShow from './executionShow';
import ExecutionEdit from './executionEdit';
import ExecutionDelete from './executionDelete';

import getDebugLog from './debugLog';
const debug = getDebugLog('view');

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing(2),
    width: '100%',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IProps {
  match: any;
}

const View = (props: IProps) => {
  const { match: { path } } = props;
  const classes = useStyles();
  debug('View', { path });

  return (
    <div className={classes.root}>
      <Switch>
        <Route path={`${path}/new`} component={ExecutionNew} />
        <Route path={`${path}/:executionId/delete`} render={ExecutionDelete} />
        <Route path={`${path}/:executionId/edit`} render={ExecutionEdit} />
        <Route path={`${path}/:executionId`} render={ExecutionShow} />
        <Route path={path} component={ExecutionEmptyState} />
      </Switch>
    </div>
  );
};

export default View;
