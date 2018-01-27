import * as React from 'react';
import styles from './styles.scss';

interface IProps {
  data: number[];
  barStyle: string;
  barMax: number;
}

export default ({ data, barStyle, barMax }: IProps) => {
  const barHeight = 10;
  const count = data.length - 1;
  const rects = data.map((value, index) => {
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
    <div className={styles.histContainer}>
      <svg className={styles.svgBox}>
        <g transform={`translate(${5},${5}) scale(.95, 1)`}>
          {rects}
        </g>
      </svg>
    </div>
  );
};
