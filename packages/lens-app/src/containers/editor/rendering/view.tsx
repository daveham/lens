import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';

import RenderingEmptyState from './renderingEmptyState';
import RenderingNew from './renderingNew';
import RenderingShow from './renderingShow';
import RenderingEdit from './renderingEdit';
import RenderingDelete from './renderingDelete';

import _debug from 'debug';
const debug = _debug('lens:editor:rendering:view');

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
        <Route path={`${path}/new`} component={RenderingNew} />
        <Route path={`${path}/:renderingId/delete`} render={RenderingDelete} />
        <Route path={`${path}/:renderingId/edit`} render={RenderingEdit} />
        <Route path={`${path}/:renderingId`} render={RenderingShow} />
        <Route path={path} component={RenderingEmptyState} />
      </Switch>
    </div>
  );
};

export default View;
