import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles: any = (theme) => {
  const paddingHalf = theme.spacing(1);
  const padding = paddingHalf * 2;
  const fixedWidth = theme.spacing(34);
  return {
    root: {
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
    },
    split: {
      flex: '1 0 auto',
      display: 'flex',
    },
    splitLeft: {
      width: fixedWidth,
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
    formHeader: {
      backgroundColor: theme.palette.primary.dark,
      display: 'flex',
    },
    formTitle: {
      padding: `${paddingHalf}px ${padding}px`,
      width: fixedWidth,
    },
    formTitleColor: {
      color: theme.palette.primary.contrastText,
    },
    formControls: {
      color: theme.palette.primary.contrastText,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  };
};

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:common:layout');

interface IProps {
  classes?: any;
  controls?: any;
  contentLeft?: any;
  contentRight?: any;
  title: string;
}

const Layout = ({
  classes,
  controls,
  contentLeft,
  contentRight,
  title,
}: IProps) => {
  const formTitleColorClasses: any = {
    colorTextPrimary: classes.formTitleColor
  };

  return (
    <Paper classes={{ root: classes.root }}>
      <div className={classes.formHeader}>
        <div className={classes.formTitle}>
          <Typography
            classes={formTitleColorClasses}
            color='textPrimary'
            variant='h5'
          >
            {title}
          </Typography>
        </div>
        <div className={classes.formControls}>
          {controls}
        </div>
      </div>
      <div className={classes.split}>
        <div className={classes.splitLeft}>
          {contentLeft}
        </div>
        <div className={classes.splitRight}>
          {contentRight}
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(Layout);
