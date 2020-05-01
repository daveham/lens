import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Layout, { formTitleWidthSpacingMultiplier } from './layout';

const styles: any = theme => {
  const paddingHalf = theme.spacing(1);
  const padding = paddingHalf * 2;
  return {
    split: {
      flex: '1 0 auto',
      display: 'flex',
    },
    splitLeft: {
      width: theme.spacing(formTitleWidthSpacingMultiplier),
      borderRight: `solid 1px ${theme.palette.divider}`,
      padding: `${paddingHalf}px ${padding}px ${padding}px`,
      display: 'flex',
      flexDirection: 'column',
    },
    splitRight: {
      flex: '1 0 auto',
      padding: `${paddingHalf}px ${padding}px ${padding}px`,
      display: 'flex',
      flexDirection: 'column',
    },
  };
};

// import getDebugLog from './debugLog';
// const debug = getDebugLog('splitLayout');

interface IProps {
  classes?: any;
  controls?: any;
  contentLeft?: any;
  contentRight?: any;
  title: string;
}

const SplitLayout = ({ classes, controls, contentLeft, contentRight, title }: IProps) => {
  return (
    <Layout
      controls={controls}
      title={title}
    >
      <div className={classes.split}>
        <div className={classes.splitLeft}>{contentLeft}</div>
        <div className={classes.splitRight}>{contentRight}</div>
      </div>
    </Layout>
  );
};

export default withStyles(styles)(SplitLayout);
