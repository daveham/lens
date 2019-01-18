import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

const styles = (theme) => {
  const { unit } = theme.spacing;
  return {
    root: {
      minHeight: 6 * unit,
      '&$expanded': {
        minHeight: 6 * unit,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  };
};

const ExpansionPanelSummary = withStyles(styles)((props) =>
  <MuiExpansionPanelSummary {...props} />);

// @ts-ignore
ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';
export default ExpansionPanelSummary;
