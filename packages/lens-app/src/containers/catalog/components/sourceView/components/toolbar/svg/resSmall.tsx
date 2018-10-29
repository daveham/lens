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
  classes: any;
}

export default withStyles(styles)(({ classes }: IProps) => {
  return (
    <svg className={classes.svgResButtonBox}>
      <g className={classes.resButtonRect}>
        <rect x={1} y={1} width={4} height={4}/>
        <rect x={7} y={1} width={4} height={4}/>
        <rect x={13} y={1} width={4} height={4}/>
        <rect x={1} y={7} width={4} height={4}/>
        <rect x={7} y={7} width={4} height={4}/>
        <rect x={13} y={7} width={4} height={4}/>
        <rect x={1} y={13} width={4} height={4}/>
        <rect x={7} y={13} width={4} height={4}/>
        <rect x={13} y={13} width={4} height={4}/>
      </g>
    </svg>
  );
});
