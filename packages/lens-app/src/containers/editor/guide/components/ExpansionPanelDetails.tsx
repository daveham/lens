import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const styles = (theme) => {
  const { borderRadius } = theme.shape;
  return {
    root: {
      backgroundColor: theme.editor.guide.background,
      borderRadius: borderRadius * 2,
    },
  };
};

export default withStyles(styles)((props) =>
  <MuiExpansionPanelDetails {...props} />);
