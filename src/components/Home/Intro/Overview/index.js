import React from 'react';
import * as styles from './styles.scss';

const img1 = makeImgUrl('DMEvenGen500.jpg');
const img2 = makeImgUrl('EveningCloudsDavisMountains500.jpg');
const img3 = makeImgUrl('EveSrcCut.jpg');
const img4 = makeImgUrl('DMEvenCut.png');

function makeImgUrl(file) {
  if (process.env.NODE_ENV === 'production') {
    return `/lens/build/images/${file}`;
  }
  return `/build/images/${file}`;
}

export default () => {
  return (
    <div>
      <p>
        Generate this image:
      </p>
      <img src={img1} alt='' className={styles.framedImage}/>
      <p>
        From this photo:
      </p>
      <img src={img2} alt=''
           className={styles.framedImage}/>
      <p>
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
