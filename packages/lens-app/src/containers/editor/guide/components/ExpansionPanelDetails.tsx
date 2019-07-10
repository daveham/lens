import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const styles = theme => {
  const borderRadius = theme.shape.borderRadius * 2;
  return {
    root: {
      backgroundColor: theme.editor.guide.background,
      padding: 0,
      '&:last-child': {
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        overflow: 'hidden',
      },
    },
  };
};

export default withStyles(styles)((props: any) => <MuiExpansionPanelDetails {...props} />);
