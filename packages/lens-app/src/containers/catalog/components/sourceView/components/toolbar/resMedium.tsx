import React from 'react';
import styles from './styles.scss';

export default () => {
  return (
    <svg className={styles.svgResButtonBox}>
      <g className={styles.resButtonRect}>
        <rect x={2} y={2} width={6} height={6}/>
        <rect x={10} y={2} width={6} height={6}/>
        <rect x={2} y={10} width={6} height={6}/>
        <rect x={10} y={10} width={6} height={6}/>
      </g>
    </svg>
  );
};
