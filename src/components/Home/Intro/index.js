import React from 'react';
import styles from '../styles.scss';

export default () => {
  return (
    <div>
      <p className={styles.normal}>
        Generate this image:
      </p>
      <img src='/build/images/DMEvenGen500.jpg' alt='' className={styles.framedImage}/>
      <p className={styles.normal}>
        From this photo:
      </p>
      <img src='/build/images/EveningCloudsDavisMountains500.jpg' alt=''
           className={styles.framedImage}/>
      <p className={styles.normal}>
        Detail:
      </p>
      <div className={styles.cutContainer}>
        <div>
          <img src='/build/images/EveSrcCut.jpg' alt='' className={styles.framedImage}/>
        </div>
        <div>
          <img src='/build/images/DMEvenCut.png' alt='' className={styles.framedImage}/>
        </div>
      </div>
    </div>
  );
};
