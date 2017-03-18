import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Details from './Details';

import styles from './styles.scss';

const Summary = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.returnToCatalog}>
        <Link to={'/catalog'}><span className='glyphicon glyphicon-circle-arrow-left'></span></Link>
      </div>
      <div className={styles.thumbnailSection}>
        <img className={styles.thumbnail} src={props.thumbnailImageUrl}/>
      </div>
      <div className={styles.detailsSection}>
        <Details stats={props.stats} />
      </div>
    </div>
  );
};

Summary.propTypes = {
  thumbnailImageUrl: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired
};

export default Summary;


