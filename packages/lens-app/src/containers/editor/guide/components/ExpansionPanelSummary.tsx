import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

const styles = theme => {
  const unit = theme.spacing(1);
  const panelHeight = 6 * unit;
  const margin = `${unit}px 0`;
  return {
    root: {
      minHeight: panelHeight,
      '&$expanded': {
        minHeight: panelHeight,
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
