import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const infoWidth = 150;
const infoHeight = 170;
const svgWidth = infoWidth - 4;
const svgHeight = infoHeight - 44;
const histContainerWidth = infoWidth;
const histContainerHeight = infoHeight - 40;

const styles: any = {
  histContainer: {
    width: histContainerWidth,
    height: histContainerHeight,
  },
  svgBox: {
    width: svgWidth,
    height: svgHeight,
  },
};

interface IProps {
  classes: any;
  data: number[];
  barStyle: string;
  barMax: number;
}

export default withStyles(styles)(({ classes, data, barStyle, barMax }: IProps) => {
  const barHeight = 10;
  const count = data.length - 1;
  const widths = data.map((value, index) => ({ value, index }));
  const filtered = widths.filter((item) => item.value);
  const rects = filtered.map(({ value, index }) => {
    const revIndex = count - index;
    return (
      <rect
        key={index}
        className={barStyle}
        x={0}
        y={revIndex * (barHeight + 2)}
        width={`${100 * value / barMax}%`}
        height={barHeight}
      />
    );
  });

  return (
    <div className={classes.histContainer}>
      <svg className={classes.svgBox}>
        <g transform={`translate(${0},${0}) scale(.95, 1)`}>
          {rects}
        </g>
      </svg>
    </div>
  );
});
