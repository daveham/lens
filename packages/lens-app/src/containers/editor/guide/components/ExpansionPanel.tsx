import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';

const styles = (theme) => {
  const { unit } = theme.spacing;
  const panelHeight = 6 * unit;
  const borderRadius = theme.shape.borderRadius * 2;
  const margin = `${unit}px 0`;
  return {
    root: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius,
      margin,
      '&:first-child': {
        borderRadius,
        margin,
      },
      '&:last-child': {
        borderRadius,
        margin,
      },
    },
    expanded: {
      margin,
      minHeight: panelHeight,
    },
  };
};

export default withStyles(styles)((props) =>
  <MuiExpansionPanel {...props} />);
