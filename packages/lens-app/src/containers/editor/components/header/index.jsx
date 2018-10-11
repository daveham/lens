import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    '& div:first-child': {
      marginRight: 'auto'
    }
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    paddingBottom: 4
  }
};

export default withStyles(styles)((props) => {
  const { classes } = props;
  const title = props.loading ? `${props.title} (loading...)` : props.title;
  const bcElement = props.breadcrumb ? props.breadcrumb : null;
  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        {bcElement}
        <div className={classes.title}>{title}</div>
      </div>
      {props.children}
    </div>
  );
});
