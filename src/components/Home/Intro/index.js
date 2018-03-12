import React from 'react';
import styles from '../styles.scss';

function makeImgUrl(file) {
  if (process.env.NODE_ENV === 'production') {
    return `/lens/build/images/${file}`;
  }
  return `/build/images/${file}`;
}

const img1 = makeImgUrl('DMEvenGen500.jpg');
const img2 = makeImgUrl('EveningCloudsDavisMountains500.jpg');
const img3 = makeImgUrl('EveSrcCut.jpg');
const img4 = makeImgUrl('DMEvenCut.png');

export default () => {
  return (
    <div>
      <p className={styles.normal}>
        Generate this image <code>{img2}</code>:
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
