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
        Lens is a tool for “inferring” an image from a photograph with the inference performed via
        creative algorithms. The process begins with an analysis of the photograph, accumulating
        information used as input into various simulations. One or more simulations are conducted,
        ranging from simple finite automata to more complex emergent behavior. Output from the
        simulations is rendered as a new image.
      </p>
      <p>
        As a simple example, using this photograph as input:
      </p>
      <img src={img2} alt='' className={styles.framedImage}/>
      <p>
        This image was generated by applying a bin packing algorithm (simulation), driven by an
        analysis of the change in luminosity across the input photograph.
      </p>
      <img src={img1} alt=''
           className={styles.framedImage}/>
      <p>
        Here are full-resolution details taken from the input photograph and the corresponding
        region in the rendered image.
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
