import React from 'react';
import { useSelector as useSelectorGeneric, TypedUseSelectorHook } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';

import { RootEditorState } from 'editor/modules';
import { executionDeleteListSelector } from 'editor/modules/selectors';

import Layout from '../../simulation/common/layout';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:executionDelete:view');

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    margin: theme.spacing(2),
  },
  listWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IProps {
  simulationId?: string;
  executionId?: string;
}

const View = ({ simulationId, executionId }: IProps) => {
  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;

  const executionDeleteList =
    // @ts-ignore
    useSelector(state => executionDeleteListSelector(state, simulationId, executionId));

  const classes = useStyles();

  return (
    <Layout title='Execution'>
      <Paper className={classes.root}>
        {executionDeleteList.length > 0 && (
          <div className={classes.listWrapper}>
            <List
              subheader={
                <ListSubheader disableSticky color='primary'>
                  These items will be deleted:
                </ListSubheader>
              }
            >
              {executionDeleteList.map(({ key, type, name }) => (
                <ListItem key={key}>
                  <ListItemText primary={name} secondary={`${type} ${key}`} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </Paper>
    </Layout>
  );
};

export default View;
