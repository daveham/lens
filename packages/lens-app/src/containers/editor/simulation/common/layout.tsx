import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export const formTitleWidthSpacingMultiplier = 34;

const styles: any = (theme) => {
  const paddingHalf = theme.spacing(1);
  const padding = paddingHalf * 2;
  const fixedWidth = theme.spacing(formTitleWidthSpacingMultiplier);
  return {
    root: {
      flex: '1 0 auto',
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

// import getDebugLog from './debugLog';
// const debug = getDebugLog('layout');

interface IProps {
  children?: any;
  classes?: any;
  controls?: any;
  title: string;
}

const Layout = ({
  children,
  classes,
  controls,
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
      {children}
    </Paper>
  );
};

export default withStyles(styles)(Layout);
