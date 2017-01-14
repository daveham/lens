import React, { PropTypes } from 'react';
import SourceItemDetailsClearButton from './SourceItemDetailsClearButton';

import styles from './SourceItemDetails.scss';

const SourceItemDetails = (props) => {

  const loaded = props.status;

  let button = null;
  if (loaded) {
    button = <SourceItemDetailsClearButton id={props.id} clear={props.clear} />;
  }

  let details = null;
  if (loaded) {
    if (props.error) {
      details = (
        <dl className={'dl-horizontal'}>
          <dt>file</dt><dd>{props.filename}</dd>
          <dt>status</dt><dd className={styles.dataerror}>File Error</dd>
        </dl>
      );
    } else {
      details = (
        <dl className={'dl-horizontal'}>
          <dt>file</dt><dd>{props.filename}</dd>
          <dt>status</dt><dd>{props.status}</dd>
          <dt>size</dt><dd>{props.size}</dd>
          <dt>created</dt><dd>{props.ctime}</dd>
          <dt>format</dt><dd>{props.format}</dd>
          <dt>dimensions</dt><dd>{props.width} x {props.height} x {props.depth}</dd>
          <dt>file size</dt><dd>{props.filesize}</dd>
          <dt>resolution</dt><dd>{props.resolution}</dd>
        </dl>
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        {details}
      </div>
      <div>
        {button}
      </div>
    </div>
  );
};

SourceItemDetails.propTypes = {
  id: PropTypes.string,
  error: PropTypes.string,
  filename: PropTypes.string,
  status: PropTypes.string,
  size: PropTypes.number,
  ctime: PropTypes.string,
  format: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  depth: PropTypes.number,
  filesize: PropTypes.string,
  resolution: PropTypes.string,
  clear: PropTypes.func
};

SourceItemDetails.defaultProps = {
  clear: () => {}
};

export default SourceItemDetails;
