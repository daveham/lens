import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles} from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:trails');

const styles: any = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: theme.spacing.unit * 15,
    maxWidth: theme.spacing.unit * 20,
  },
  list: {
    border: `1px solid ${theme.palette.divider}`,
  },
});

interface IProps {
  classes?: any;
}

export default withStyles(styles)(({ classes }: IProps) => (
  <div className={classes.root}>
    <List dense disablePadding className={classes.list}>
      <ListItem
        button
        selected
      >
        <ListItemText primary='Simple' />
      </ListItem>
      <ListItem
        button
      >
        <ListItemText primary='One' />
      </ListItem>
      <ListItem
        button
      >
        <ListItemText primary='Two' />
      </ListItem>
      <ListItem
        button
      >
        <ListItemText primary='Three' />
      </ListItem>
    </List>
  </div>
));
