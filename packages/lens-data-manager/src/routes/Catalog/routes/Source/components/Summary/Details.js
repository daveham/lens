import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './Details.scss';

const addCommas = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDate =  (v) => moment(v).format('h:mm a, MM/DD/YY');

const detailsTemplate = [
  { l: 'ModifiedX', k: 'ctime', c: formatDate },
  { g: [
    { l: 'Size', k: 'size', c: addCommas },
    { l: 'File Size', k: 'filesize' }
  ]},
  { l: 'Format', k: 'format' },
  { g: [
    { l: 'Width', k: 'width', c: addCommas },
    { l: 'Height', k: 'height', c: addCommas }
   ]},
  { g: [
    { l: 'Resolution', k: 'resolution' },
    { l: 'Depth', k: 'depth' },
  ]}
];

const createValueFromDetail = (value, converter) => {
  if (!value) return '...';
  return converter ? converter(value) : value;
};

const renderDetailColumns = (stats, detail, key) => {
  return ([
    <div key={`${key}-l`} className={styles.label}>{ detail.l }</div>,
    <div key={`${key}-d`} className={styles.detail}>{ createValueFromDetail(stats[detail.k], detail.c) }</div>
  ]);
};

const renderDetailRow = (stats, detail, key) => {
  return (
    <div key={key} className={styles.row}>
      { Array.isArray(detail) ?
        detail.map(column => renderDetailColumns(stats, column)) :
        renderDetailColumns(stats, detail) }
    </div>
  );
};

const Details = ({ stats }) => {
  return (
    <div className={styles.container}>
      { detailsTemplate.map((detail, index) => renderDetailRow(stats, detail.g || detail, index)) }
    </div>
  );
};

Details.propTypes = {
  stats: PropTypes.object.isRequired
};

export default Details;
