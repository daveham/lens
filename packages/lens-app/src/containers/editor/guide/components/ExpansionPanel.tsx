import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';

const styles = (theme) => {
  const { unit } = theme.spacing;
  const { borderRadius } = theme.shape;
  return {
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: borderRadius * 2,
      margin: `${unit}px 0`,
      '&:first-child': {
        borderRadius: borderRadius * 2,
        margin: `${unit}px 0`,
      },
      '&:last-child': {
        borderRadius: borderRadius * 2,
        margin: `${unit}px 0`,
      },
    },
    //   border: '1px solid rgba(0,0,0,.125)',
    //   boxShadow: 'none',
    //   '&:not(:last-child)': {
    //     borderBottom: 0,
    //   },
    //   '&:before': {
    //     display: 'none',
    //   },
    // },
    expanded: {
      margin: `${unit}px 0`,
      minHeight: unit * 6,
    },
  };
};

export default withStyles(styles)((props) =>
  <MuiExpansionPanel {...props} />);
