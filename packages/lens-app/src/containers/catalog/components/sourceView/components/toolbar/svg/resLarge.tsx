import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  svgResButtonBox: {
    width: 18,
    height: 18,
  },
  resButtonRect: {
    stroke: theme.palette.primary.dark,
    strokeWidth: 1,
    fill: 'none',
  },
});

interface IProps {
  classes?: any;
}

export const ResLarge = withStyles(styles)(({ classes }: IProps) => {
  return (
    <svg className={classes.svgResButtonBox}>
      <g className={classes.resButtonRect}>
        <rect x={2} y={2} width={14} height={14}/>
      </g>
    </svg>
  );
});
