import React from 'react';
import { useSelector as useSelectorGeneric, TypedUseSelectorHook } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core/styles';

import { RootEditorState } from 'editor/modules';
import { simulationDeleteListSelector } from 'editor/modules/selectors';

import Layout from '../common/layout';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationDelete:view');

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
}

const View = ({ simulationId }: IProps) => {
  const useSelector: TypedUseSelectorHook<RootEditorState> = useSelectorGeneric;

  const simulationDeleteList =
    // @ts-ignore
    useSelector(state => simulationDeleteListSelector(state, simulationId));

  const classes = useStyles();

  return (
    <Layout title='Simulation'>
      <Paper className={classes.root}>
        <div className={classes.listWrapper}>
          <List
            subheader={
              <ListSubheader disableSticky color='primary'>
                These items will be deleted:
              </ListSubheader>
            }
          >
            {simulationDeleteList.map(({ key, type, name }) => (
              <ListItem key={key}>
                <ListItemText primary={name} secondary={`${type} ${key}`} />
              </ListItem>
            ))}
          </List>
        </div>
      </Paper>
    </Layout>
  );
};

export default View;
