import React from 'react';
import styles from './styles.scss';

export default () => {
  return (
    <svg className={styles.svgResButtonBox}>
      <g className={styles.resButtonRect}>
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
};
