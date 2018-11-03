import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';

const styles: any = (theme) => {
  const { analysis } = theme.editor;
  const { bars, histogram } = analysis;

  return {
    histogramContainer: {
      minWidth: analysis.width,
      minHeight: histogram.height,
      paddingTop: 4,
      paddingBottom: 4,
    },
    svgBox: {
      width: analysis.width - 4,
      height: bars.height,
    },
  };
};

interface IProps {
  theme: any;
  classes: any;
  data: number[];
  barStyle: string;
  barMax: number;
}

export default withTheme()(withStyles(styles)(({ theme, classes, data, barStyle, barMax }: IProps) => {
  const { height, gap } = theme.editor.analysis.bar;
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
        y={revIndex * (height + gap)}
        width={`${100 * value / barMax}%`}
        height={height}
      />
    );
  });

  return (
    <div className={classes.histogramContainer}>
      <svg className={classes.svgBox}>
        <g transform={`translate(${0},${0}) scale(.95, 1)`}>
          {rects}
        </g>
      </svg>
    </div>
  );
}));
