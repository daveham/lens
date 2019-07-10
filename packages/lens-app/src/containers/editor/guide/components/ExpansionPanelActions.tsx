import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

const styles = theme => {
  const borderRadius = theme.shape.borderRadius * 2;
  return {
    root: {
      backgroundColor: theme.editor.guide.background,
      padding: 0,
      '&:last-child': {
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      },
    },
  };
};

export default withStyles(styles)((props: any) => <MuiExpansionPanelActions {...props} />);
