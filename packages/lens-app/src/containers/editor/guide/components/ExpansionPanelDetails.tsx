import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const styles = theme => {
  const borderRadius = theme.shape.borderRadius * 2;
  return {
    root: {
      backgroundColor: theme.editor.guide.background,
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      padding: 0,
    },
  };
};

export default withStyles(styles)(props => <MuiExpansionPanelDetails {...props} />);
