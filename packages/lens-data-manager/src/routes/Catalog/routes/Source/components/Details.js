import React, { PropTypes } from 'react';
import moment from 'moment';

import styles from './Details.scss';

const addCommas = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const detailsTemplate = [
  { l: 'Modified', v: 'ctime', c: (v) =>  moment(v).format('h:mm a, MM/DD/YY') },
  { g: [
    { l: 'Size', v: 'size', c: addCommas },
    { l: 'File Size', v: 'filesize' }
  ]},
  { l: 'Format', v: 'format' },
  { g: [
    { l: 'Width', v: 'width', c: addCommas },
    { l: 'Height', v: 'height', c: addCommas }
   ]},
  { g: [
    { l: 'Resolution', v: 'resolution' },
    { l: 'Depth', v: 'depth' },
  ]}
];

const createValueFromDetail = (value, converter) => {
  if (value) {
    if (converter) {
      return converter(value);
    }
    return value;
  }
  return '...';
};

const renderDetailRow = (stats, detail, key) => {
  if (Array.isArray(detail)) {
    return (
      <div key={key} className={styles.row}>
      {
        detail.map((column) => {
          return ([
            <div className={styles.label}>{ column.l }</div>,
            <div className={styles.detail}>{ createValueFromDetail(stats[column.v], column.c) }</div>
          ]);
        })
      }
      </div>
    );
  }

  return (
    <div key={key} className={styles.row}>
      <div className={styles.label}>{ detail.l }</div>
      <div className={styles.detail}>{ createValueFromDetail(stats[detail.v], detail.c) }</div>
    </div>
  );
};

const Details = ({ stats }) => {
  const rows = detailsTemplate.map((detail, index) => {
    return renderDetailRow(stats, detail.g || detail, index);
  });

  return (
    <div className={styles.container}>
      { rows }
    </div>
  );
};

Details.propTypes = {
  stats: PropTypes.object.isRequired
};

export default Details;
