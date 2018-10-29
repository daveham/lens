import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  data: {
    textAlign: 'center',
  },
};

export default withStyles(styles)(({ classes }) => {
  return (
    <div className={classes.container}>
      <div className={classes.data}>
        <Typography variant='h4' gutterBottom noWrap>
          Home
        </Typography>
        <Typography variant='body1'>
          The Inference Lens - description.
        </Typography>
      </div>
    </div>
  );
});
