import React from 'react';
import styles from '../styles.scss';

function makeImgUrl(url) {
  if (process.env.NODE_ENV === 'production') {
    return url;
  }
  return '/' + url;
}

const img1 = makeImgUrl('build/images/DMEvenGen500.jpg');
const img2 = makeImgUrl('build/images/EveningCloudsDavisMountains500.jpg');
const img3 = makeImgUrl('build/images/EveSrcCut.jpg');
const img4 = makeImgUrl('build/images/DMEvenCut.png');

export default () => {
  return (
    <div>
      <p className={styles.normal}>
        Generate this image:
      </p>
      <img src={img1} alt='' className={styles.framedImage}/>
      <p className={styles.normal}>
        From this photo:
      </p>
      <img src={img2} alt=''
           className={styles.framedImage}/>
      <p className={styles.normal}>
        Detail:
      </p>
      <div className={styles.cutContainer}>
        <div>
          <img src={img3} alt='' className={styles.framedImage}/>
        </div>
        <div>
          <img src={img4} alt='' className={styles.framedImage}/>
        </div>
      </div>
    </div>
  );
};
