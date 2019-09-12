import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

const styles = theme => {
  const margin = theme.spacing(1, 0);
  const minHeight = 57; // theme.spacing(6);
  const borderRadius = theme.shape.borderRadius * 2;
  return {
    root: {
      borderRadius,
      minHeight,
      '&$expanded': {
        minHeight,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.primary.light,
      },
    },
    content: {
      margin,
      '&$expanded': {
        margin,
      },
    },
    expanded: {},
  };
};

const ExpansionPanelSummary = withStyles(styles)((props: any) =>
  <MuiExpansionPanelSummary {...props} />);

// @ts-ignore
ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';
export default ExpansionPanelSummary;
