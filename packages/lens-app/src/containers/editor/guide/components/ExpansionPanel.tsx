import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';

const styles = theme => {
  const borderRadius = theme.shape.borderRadius * 2;
  const margin = theme.spacing(1, 0);
  return {
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius,
      margin,
      '&:first-child': {
        borderRadius,
        marginTop: 0,
        marginBottom: theme.spacing(1),
      },
      '&:last-child': {
        borderRadius,
        margin,
      },
      '&.Mui-expanded': {
        margin,
      },
    },
    expanded: {
      margin,
      minHeight: theme.spacing(6),
    },
  };
};

export default withStyles(styles)((props: any) => <MuiExpansionPanel {...props} />);
