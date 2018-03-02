import React from 'react';
import styles from './styles.scss';

export default () => {
  return (
    <svg className={styles.svgResButtonBox}>
      <g className={styles.resButtonRect}>
        <rect x={2} y={2} width={14} height={14}/>
      </g>
    </svg>
  );
};
