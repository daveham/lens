import * as React from 'react';
import moment from 'moment';
import styles from './styles.scss';

const addCommas = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDate =  (v) => moment(v).format('h:mm a, MM/DD/YY');

const detailsTemplate = [
  { l: 'Modified', k: 'ctime', c: formatDate },
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
  if (!value) {
    return '...';
  }
  return converter ? converter(value) : value;
};

const renderDetailColumns = (stats, detail, key) => {
  return ([
    <div key={`${key}-l`} className={styles.label}>{detail.l}</div>,
    <div key={`${key}-d`} className={styles.detail}>{createValueFromDetail(stats[detail.k], detail.c)}</div>
  ]);
};

const renderDetailRow = (stats, detail, key) => {
  return (
    <div key={key} className={styles.row}>
      {
        Array.isArray(detail) ?
          detail.map((column, index) => renderDetailColumns(stats, column, index)) :
          renderDetailColumns(stats, detail, 0)
      }
    </div>
  );
};

const Details = ({ stats }) => {
  return (
    <div className={styles.container}>
      {detailsTemplate.map((detail: any, index) => renderDetailRow(stats, detail.g || detail, index))}
    </div>
  );
};

export default Details;
